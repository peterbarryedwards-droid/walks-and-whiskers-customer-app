export default async function handler(req, res) {
  const { state } = req.query;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.events",
    access_type: "offline",
    prompt: "consent",
    state: state || "user",
  });
  return res.redirect(302, "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString());
}

