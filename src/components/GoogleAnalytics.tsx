"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Google Analytics 4 (gtag.js) — lädt AUSSCHLIESSLICH nach Einwilligung über
// den Cookie-Banner (DSGVO): ohne Zustimmung wird kein einziges Byte an
// Google übertragen. Der CookieBanner feuert "cookie-consent-changed",
// damit GA direkt nach dem Klick auf "Zustimmen" startet (ohne Reload).
const GA_ID = "G-6MVVNFBLMT";

export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const check = () =>
      setConsented(localStorage.getItem("cookie-consent") === "true");
    check();
    window.addEventListener("cookie-consent-changed", check);
    return () => window.removeEventListener("cookie-consent-changed", check);
  }, []);

  if (!consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
