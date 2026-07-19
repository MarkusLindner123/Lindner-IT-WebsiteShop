// SEO-Audit für lindner-tech.com — läuft ohne npm-Dependencies (Node ≥ 18).
//
//   pnpm seo:audit                        → prüft die Live-Domain
//   pnpm seo:audit -- --site http://localhost:3000   → gegen lokalen Build
//
// Zugangsdaten: Service-Account-JSON über GOOGLE_APPLICATION_CREDENTIALS
// (env oder .env.local), GA-Property über GA_PROPERTY_ID. Der Key liegt
// bewusst AUSSERHALB des Repos und darf nie committet werden.
//
// Report: seo-reports/seo-audit-<datum>.md (Ordner ist gitignored).
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

// ---------- Konfiguration ----------
const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};

// .env.local als Fallback für env-Variablen einlesen
const envLocal = {};
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) envLocal[m[1]] = m[2];
  }
}
const env = (name) => process.env[name] ?? envLocal[name];

const SITE = (argVal("--site") ?? "https://lindner-tech.com").replace(/\/$/, "");
const KEY_PATH = argVal("--key") ?? env("GOOGLE_APPLICATION_CREDENTIALS");
const GA_PROPERTY = argVal("--ga-property") ?? env("GA_PROPERTY_ID");
const IS_LOCAL = /localhost|127\.0\.0\.1/.test(SITE);

const report = [];
const summary = [];
const log = (line = "") => {
  console.log(line);
  report.push(line);
};
const item = (status, text) => {
  summary.push({ status, text });
  log(`- ${status} ${text}`);
};

log(`# SEO-Audit — ${SITE}`);
log(`Erstellt: ${new Date().toISOString()}`);
log();

// ---------- Google-Auth (Service Account → OAuth-Token) ----------
async function getToken(scopes) {
  if (!KEY_PATH || !existsSync(KEY_PATH)) return null;
  const key = JSON.parse(readFileSync(KEY_PATH, "utf8"));
  const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url({ alg: "RS256", typ: "JWT" })}.${b64url({
    iss: key.client_email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer.sign(key.private_key).toString("base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const tok = await res.json();
  return tok.access_token
    ? { headers: { Authorization: `Bearer ${tok.access_token}` }, email: key.client_email }
    : null;
}

// ---------- Hilfen: HTML-Auswertung ohne Parser-Dependency ----------
const grab = (html, re) => html.match(re)?.[1]?.trim();
const metaContent = (html, name) =>
  grab(html, new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`, "i")) ??
  grab(html, new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`, "i"));

async function auditPage(pathName) {
  const url = `${SITE}${pathName}`;
  let res;
  try {
    res = await fetch(url, { redirect: "follow" });
  } catch (e) {
    item("❌", `${pathName} — nicht erreichbar (${e.message})`);
    return;
  }
  if (!res.ok) {
    item("❌", `${pathName} — HTTP ${res.status}`);
    return;
  }
  const html = await res.text();
  const title = grab(html, /<title[^>]*>([^<]*)<\/title>/i) ?? "";
  const desc = metaContent(html, "description") ?? "";
  const canonical = grab(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ?? "";
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  const hreflangs = (html.match(/hreflang=/gi) ?? []).length;
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
  const ogTitle = metaContent(html, "og:title");
  const ogImage = metaContent(html, "og:image");
  const ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) ?? [];
  let ldOk = true;
  for (const block of ldBlocks) {
    try {
      JSON.parse(block.replace(/<script[^>]*>|<\/script>/g, ""));
    } catch {
      ldOk = false;
    }
  }

  log(`\n### ${pathName || "/"}`);
  item(title ? "✅" : "❌", `Title (${title.length} Zeichen): ${title.slice(0, 80)}`);
  if (title.length > 65) item("⚠️", `Title länger als ~60 Zeichen — Google kürzt evtl.`);
  item(desc ? "✅" : "❌", `Description (${desc.length} Zeichen)`);
  if (desc && (desc.length < 80 || desc.length > 175)) item("⚠️", `Description-Länge außerhalb 80–175`);
  item(canonical ? "✅" : "⚠️", `Canonical: ${canonical || "fehlt"}`);
  item(h1Count === 1 ? "✅" : "⚠️", `H1-Anzahl: ${h1Count} (Soll: genau 1)`);
  item(hreflangs >= 3 ? "✅" : "⚠️", `hreflang-Links: ${hreflangs}`);
  item(hasNoindex ? "❌" : "✅", hasNoindex ? "noindex gesetzt!" : "kein noindex");
  if (ogTitle !== undefined) item("✅", `OpenGraph vorhanden${ogImage ? " (mit Bild)" : " — og:image fehlt"}`);
  if (ldBlocks.length) item(ldOk ? "✅" : "❌", `JSON-LD: ${ldBlocks.length} Block/Blöcke, ${ldOk ? "valide" : "PARSE-FEHLER"}`);
}

// ---------- 1) On-Page ----------
log(`## 1. On-Page-Checks`);
const PAGES = ["/", "/en", "/pl", "/imprint", "/privacy"];
for (const p of PAGES) await auditPage(p);

// ---------- 2) robots.txt & sitemap.xml ----------
log(`\n## 2. robots.txt & Sitemap`);
try {
  const robots = await (await fetch(`${SITE}/robots.txt`)).text();
  item(/sitemap/i.test(robots) ? "✅" : "⚠️", `robots.txt erreichbar${/sitemap/i.test(robots) ? ", verweist auf Sitemap" : ", OHNE Sitemap-Verweis"}`);
  const smRes = await fetch(`${SITE}/sitemap.xml`);
  const sm = await smRes.text();
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  item(smRes.ok && locs.length ? "✅" : "❌", `Sitemap: HTTP ${smRes.status}, ${locs.length} URLs`);
  let broken = 0;
  for (const loc of locs.slice(0, 15)) {
    const target = IS_LOCAL ? loc.replace(/^https?:\/\/[^/]+/, SITE) : loc;
    try {
      const r = await fetch(target, { redirect: "follow" });
      if (!r.ok) {
        broken++;
        item("❌", `Sitemap-URL ${target} → HTTP ${r.status}`);
      }
    } catch {
      broken++;
      item("❌", `Sitemap-URL ${target} → nicht erreichbar`);
    }
  }
  if (!broken) item("✅", `Alle geprüften Sitemap-URLs (max. 15) antworten mit 200`);
} catch (e) {
  item("❌", `robots/sitemap nicht prüfbar: ${e.message}`);
}

// ---------- 3) Search Console ----------
log(`\n## 3. Google Search Console`);
const auth = await getToken([
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
]);
if (!auth) {
  item("⚠️", `Kein Google-Zugriff (GOOGLE_APPLICATION_CREDENTIALS prüfen) — GSC/GA übersprungen`);
} else {
  const sites = await (await fetch("https://www.googleapis.com/webmasters/v3/sites", { headers: auth.headers })).json();
  const entries = sites.siteEntry ?? [];
  if (!entries.length) {
    item("⚠️", `Service Account hat noch keinen GSC-Zugriff. In der Search Console unter Einstellungen → Nutzer und Berechtigungen hinzufügen: ${auth.email}`);
  } else {
    const host = new URL(SITE.startsWith("http") ? SITE : `https://${SITE}`).host.replace(/^www\./, "");
    const prop =
      entries.find((e) => e.siteUrl === `sc-domain:${host}`)?.siteUrl ??
      entries.find((e) => e.siteUrl.includes(host))?.siteUrl ??
      entries[0].siteUrl;
    item("✅", `GSC-Property: ${prop}`);
    const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
    const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    for (const dim of ["query", "page"]) {
      const res = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(prop)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: { ...auth.headers, "Content-Type": "application/json" },
          body: JSON.stringify({ startDate: start, endDate: end, dimensions: [dim], rowLimit: 10 }),
        }
      );
      const data = await res.json();
      const rows = data.rows ?? [];
      log(`\nTop-${dim === "query" ? "Suchanfragen" : "Seiten"} (${start} bis ${end}):`);
      if (!rows.length) log(`_(noch keine Daten — normal bei neuer Property)_`);
      for (const r of rows)
        log(`- ${r.keys[0]} — ${r.clicks} Klicks, ${r.impressions} Impressionen, Pos. ${r.position.toFixed(1)}`);
    }
  }

  // ---------- 4) Google Analytics ----------
  log(`\n## 4. Google Analytics`);
  if (!GA_PROPERTY) {
    item("⚠️", `GA_PROPERTY_ID nicht gesetzt — GA übersprungen`);
  } else {
    const end = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const start = new Date(Date.now() - 28 * 864e5).toISOString().slice(0, 10);
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA_PROPERTY}:runReport`,
      {
        method: "POST",
        headers: { ...auth.headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          dateRanges: [{ startDate: start, endDate: end }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
        }),
      }
    );
    const data = await res.json();
    if (data.error) {
      item("⚠️", `GA Data API: ${String(data.error.message).slice(0, 140)}`);
    } else {
      const m = data.rows?.[0]?.metricValues ?? [];
      item("✅", `Letzte 28 Tage: ${m[0]?.value ?? 0} Nutzer, ${m[1]?.value ?? 0} Sitzungen, ${m[2]?.value ?? 0} Seitenaufrufe`);
    }
  }
}

// ---------- 5) PageSpeed Insights ----------
log(`\n## 5. PageSpeed Insights`);
if (IS_LOCAL) {
  item("⚠️", `Übersprungen — PSI kann localhost nicht erreichen (Audit gegen Live-Domain laufen lassen)`);
} else {
  for (const strategy of ["mobile", "desktop"]) {
    try {
      const psi = await (
        await fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(SITE)}&strategy=${strategy}&category=performance&category=seo&category=accessibility&category=best-practices`
        )
      ).json();
      const cats = psi.lighthouseResult?.categories;
      if (!cats) {
        item("⚠️", `PSI (${strategy}): ${psi.error?.message?.slice(0, 120) ?? "keine Daten"}`);
      } else {
        const pct = (c) => Math.round((c?.score ?? 0) * 100);
        item(
          pct(cats.performance) >= 80 ? "✅" : "⚠️",
          `PSI ${strategy}: Performance ${pct(cats.performance)}, SEO ${pct(cats.seo)}, A11y ${pct(cats.accessibility)}, Best Practices ${pct(cats["best-practices"])}`
        );
      }
    } catch (e) {
      item("⚠️", `PSI (${strategy}) fehlgeschlagen: ${e.message}`);
    }
  }
}

// ---------- Report schreiben ----------
const fails = summary.filter((s) => s.status === "❌").length;
const warns = summary.filter((s) => s.status === "⚠️").length;
log(`\n---\n**Ergebnis: ${summary.length} Checks — ${fails} Fehler, ${warns} Hinweise**`);

mkdirSync("seo-reports", { recursive: true });
const file = path.join("seo-reports", `seo-audit-${new Date().toISOString().slice(0, 10)}.md`);
writeFileSync(file, report.join("\n") + "\n", "utf8");
console.log(`\nReport gespeichert: ${file}`);
process.exitCode = fails > 0 ? 1 : 0;
