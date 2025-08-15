// tailwind.config.ts
import { type Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These map to CSS variables (defined in globals.css)
        "brand-primary": "var(--color-primary)",
        "brand-secondary": "var(--color-secondary)",
        "brand-accent": "var(--color-accent)",
        "brand-bg": "var(--color-bg)",
        "brand-text": "var(--color-text)",
      },
      fontFamily: {
        // Use CSS variables for font stacks
        sans: ["var(--font-sans)"],
        headline: ["var(--font-headline)"],
      },
      // optional fontSizes or other theme extensions...
    },
  },
  plugins: [],
};

export default config;
