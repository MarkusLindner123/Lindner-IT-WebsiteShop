// JSON-LD für Google Rich Results (Sterne-Bewertung im Suchergebnis).
// Die Bewertungen sind auf der Seite sichtbar (Testimonials-Sektion) —
// Voraussetzung für Googles Review-Snippet-Richtlinien.
import { SITE_URL } from "@/lib/site";

export default function StructuredData({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: "Lindner IT",
    description,
    url: SITE_URL,
    telephone: "+49 162 8036905",
    email: "markuslindner1998@gmail.com",
    founder: { "@type": "Person", name: "Markus Lindner" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Frankfurter Allee 216",
      postalCode: "10365",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
    areaServed: "Berlin",
    sameAs: [
      "https://github.com/markuslindner123",
      "https://maps.app.goo.gl/qW5Ns8LAGoEUs3yn8",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      reviewCount: 10,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
