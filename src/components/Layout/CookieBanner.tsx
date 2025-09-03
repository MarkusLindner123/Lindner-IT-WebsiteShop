"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function CookieBanner() {
  const t = useTranslations("cookieBanner"); // i18n namespace
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/4 md:right-1/4 z-50 bg-card-hero border border-gray-300 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-black text-sm md:text-base">
        {t("message")}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDecline}
          className="px-4 py-2 rounded-full border border-black/30 text-black hover:bg-black/10 transition"
        >
          {t("decline")}
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 rounded-full bg-accent-one text-black hover:bg-accent-two transition"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
