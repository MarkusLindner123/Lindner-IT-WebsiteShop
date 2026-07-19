// Zentrale Site-Konfiguration.
// NEXT_PUBLIC_SITE_URL in Vercel/.env auf die echte Domain setzen,
// z. B. https://www.lindner-it.de — ohne Slash am Ende.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
