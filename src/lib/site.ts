// Zentrale Site-Konfiguration.
// Produktiv-Domain: lindner-tech.com (bei Strato registriert, DNS → Vercel).
// NEXT_PUBLIC_SITE_URL in Vercel überschreibt den Fallback bei Bedarf.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lindner-tech.com"
).replace(/\/$/, "");
