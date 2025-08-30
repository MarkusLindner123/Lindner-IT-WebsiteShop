"use client";

import { Phone } from "lucide-react";

export default function PhoneButton() {
  const phoneNumber = "+491628036905";

  return (
    <a
      href={`tel:${phoneNumber}`}
      className="fixed bottom-24 right-[2.5%] z-[60] w-14 h-14 rounded-full bg-[rgba(10,17,40,0.6)] flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
      aria-label="Call us"
    >
      <Phone className="text-white w-7 h-7" />
    </a>
  );
}
