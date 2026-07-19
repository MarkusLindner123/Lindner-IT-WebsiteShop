// tailwind.config.ts
import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Werte spiegeln die CSS-Variablen in globals.css (dort dokumentiert).
      // Direkte Hex-Werte, damit Opacity-Modifier (z. B. bg-accent-two/20) funktionieren.
      colors: {
        "primary-dark": "#1F2937",
        "primary-light": "#F3F4F6",
        accent: "#FACC15",
        "accent-one": "#FACC15",
        "accent-two": "#60A5FA",
        link: "#2563EB",
        neutral: "#4B5563",
        success: "#10B981",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        headline: ["var(--font-headline)", "var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
