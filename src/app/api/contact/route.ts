import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Kontaktformular-Versand über Strato-SMTP (Zugangsdaten aus Env-Vars:
// lokal .env.local, in Produktion Vercel → Settings → Environment Variables).
// Absender ist das Strato-Postfach, Zustellung an CONTACT_TO (Gmail),
// Reply-To ist die Adresse aus dem Formular — Antworten gehen direkt an
// die anfragende Person.
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REASON_LABELS: Record<string, string> = {
  quote: "Angebot anfordern",
  support: "IT-Support",
  general: "Allgemeine Anfrage",
};

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const { name, email, phone, company, reason, message, _gotcha } = data;

  // Honeypot: Bots füllen das unsichtbare Feld — still "erfolgreich" antworten
  if (typeof _gotcha === "string" && _gotcha.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 200 ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    email.length > 200 ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 5000
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO;
  if (!host || !user || !pass || !to) {
    console.error("contact: SMTP-Env-Vars fehlen (SMTP_HOST/USER/PASS, CONTACT_TO)");
    return NextResponse.json({ ok: false, error: "config" }, { status: 500 });
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const cleanName = name.replace(/["\r\n]/g, "").trim();
  const lines = [
    `Name:    ${cleanName}`,
    `E-Mail:  ${email}`,
    `Telefon: ${typeof phone === "string" && phone.trim() ? phone.trim() : "—"}`,
    `Firma:   ${typeof company === "string" && company.trim() ? company.trim() : "—"}`,
    `Grund:   ${REASON_LABELS[String(reason)] ?? "—"}`,
    "",
    "Nachricht:",
    message.trim(),
  ];

  try {
    await transporter.sendMail({
      from: `"Lindner IT Website" <${user}>`,
      to,
      replyTo: `"${cleanName}" <${email}>`,
      subject: `Neue Website-Anfrage: ${REASON_LABELS[String(reason)] ?? "Kontakt"} — ${cleanName}`,
      text: lines.join("\n"),
    });
  } catch (err) {
    console.error("contact: Versand fehlgeschlagen", err);
    return NextResponse.json({ ok: false, error: "send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
