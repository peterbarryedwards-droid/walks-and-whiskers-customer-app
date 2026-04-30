export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.error) throw new Error(tokens.error_description || tokens.error);

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: "Bearer " + tokens.access_token },
    });
    const user = await userRes.json();

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    const key = "gcal_token_" + (user.email || state || "default");
    await fetch(supabaseUrl + "/rest/v1/app_settings", {
      method: "POST",
      headers: {
        "apikey": supabaseKey,
        "Authorization": "Bearer " + supabaseKey,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        key,
        data: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry: Date.now() + (tokens.expires_in * 1000),
          email: user.email,
          name: user.name,
        },
      }),
    });

    const appUrl = process.env.GOOGLE_REDIRECT_URI.replace("/api/gcal-callback", "");
    return res.redirect(302, appUrl + "?gcal=connected&email=" + encodeURIComponent(user.email));
  } catch (e) {
    console.error("OAuth callback error:", e);
    const appUrl = (process.env.GOOGLE_REDIRECT_URI || "").replace("/api/gcal-callback", "") || "https://walks-and-whiskers-customer-app.vercel.app";
    return res.redirect(302, appUrl + "?gcal=error&msg=" + encodeURIComponent(e.message));
  }
}
