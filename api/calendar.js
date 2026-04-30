async function getValidToken(email) {
  const key = "gcal_token_" + (email || "default");
  const r = await fetch(
    process.env.VITE_SUPABASE_URL + "/rest/v1/app_settings?key=eq." + key + "&select=data",
    {
      headers: {
        "apikey": process.env.VITE_SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + process.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  );
  const rows = await r.json();
  if (!rows || rows.length === 0) throw new Error("Not connected");

  let token = rows[0].data;

  // Refresh if expired (with 60s buffer)
  if (token.expiry < Date.now() + 60000) {
    if (!token.refresh_token) throw new Error("No refresh token — please reconnect Google Calendar");
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const refreshed = await refreshRes.json();
    if (refreshed.error) throw new Error("Token refresh failed: " + refreshed.error);
    token = Object.assign({}, token, {
      access_token: refreshed.access_token,
      expiry: Date.now() + (refreshed.expires_in * 1000),
    });
    // Save refreshed token
    await fetch(process.env.VITE_SUPABASE_URL + "/rest/v1/app_settings", {
      method: "POST",
      headers: {
        "apikey": process.env.VITE_SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + process.env.VITE_SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ key, data: token }),
    });
  }

  return token.access_token;
}

function buildEvent(booking) {
  const { date, timeStart, timeEnd, serviceType, petNames, ownerName, ownerAddress, careNotes, isMeetGreet } = booking;

  // Title
  const serviceEmoji = isMeetGreet ? "🤝" : serviceType === "home_sit" ? "🏠" : serviceType === "cat_visit" ? "🐱" : "🐕";
  const serviceLabel = isMeetGreet ? "Meet and Greet" : serviceType === "home_sit" ? "House Sitting" : serviceType === "cat_visit" ? "Cat Visit" : serviceType === "dog_walk" ? "Dog Walk" : "Dog Drop-in";
  const petsStr = petNames && petNames.length > 0 ? petNames.join(", ") : "";
  const title = serviceEmoji + " " + serviceLabel + (petsStr ? " — " + petsStr : "") + (ownerName ? " (" + ownerName + ")" : "");

  // Times — default to 8am-6pm for house sitting if no time given
  const isHouseSit = serviceType === "home_sit";
  const defaultStart = isHouseSit ? "08:00" : "10:00";
  const defaultEnd = isHouseSit ? "18:00" : "11:00";
  const startTime = timeStart || defaultStart;
  const endTime = timeEnd || defaultEnd;

  const startDateTime = date + "T" + startTime + ":00";
  const endDateTime = date + "T" + endTime + ":00";

  // Description
  const descParts = [];
  if (ownerAddress) descParts.push("📍 " + ownerAddress);
  if (careNotes) descParts.push("📋 " + careNotes);
  descParts.push("Added by Walks and Whiskers CRM");

  return {
    summary: title,
    location: ownerAddress || "",
    description: descParts.join("\n\n"),
    start: { dateTime: startDateTime, timeZone: "Europe/London" },
    end: { dateTime: endDateTime, timeZone: "Europe/London" },
    colorId: isMeetGreet ? "5" : isHouseSit ? "9" : "7", // banana=meet, blueberry=housesit, peacock=walk
  };
}

export default async function handler(req, res) {
  if (req.method === "GET" && req.query.action === "status") {
    // Check which accounts are connected
    try {
      const r = await fetch(
        process.env.VITE_SUPABASE_URL + "/rest/v1/app_settings?key=like.gcal_token_%&select=key,data",
        {
          headers: {
            "apikey": process.env.VITE_SUPABASE_ANON_KEY,
            "Authorization": "Bearer " + process.env.VITE_SUPABASE_ANON_KEY,
          },
        }
      );
      const rows = await r.json();
      const connected = (rows || []).map(function(row) {
        return { email: row.data.email, name: row.data.name };
      });
      return res.json({ connected });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    const { action, email, booking } = req.body;

    try {
      const accessToken = await getValidToken(email);

      if (action === "create") {
        const event = buildEvent(booking);
        const r = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        });
        const created = await r.json();
        if (created.error) throw new Error(created.error.message);
        return res.json({ success: true, eventId: created.id });
      }

      if (action === "delete") {
        const { eventId } = req.body;
        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventId, {
          method: "DELETE",
          headers: { "Authorization": "Bearer " + accessToken },
        });
        return res.json({ success: true });
      }

      return res.status(400).json({ error: "Unknown action" });
    } catch (e) {
      console.error("Calendar error:", e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}

