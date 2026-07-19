import { notFound } from "next/navigation";

// Fängt alle unbekannten Pfade innerhalb einer Locale ab,
// damit [locale]/not-found.tsx (im Locale-Layout) gerendert wird.
export default function CatchAllPage() {
  notFound();
}
