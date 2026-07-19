// JSON-LD für Google Rich Results (Sterne-Bewertung im Suchergebnis).
// Die Bewertungen sind auf der Seite sichtbar (Testimonials-Sektion) —
// Voraussetzung für Googles Review-Snippet-Richtlinien.
// hasOfferCatalog listet die vier Leistungen (SEO: B2B-IT-Service,
// Webdesign, Netzwerk, Cybersicherheit) — Namen/Beschreibungen kommen
// lokalisiert aus messages/*.json über page.tsx.
import { SITE_URL } from "@/lib/site";

type ServiceItem = { name: string; description: string };

export default function StructuredData({
  description,
  catalogName,
  services,
}: {
  description: string;
  catalogName: string;
  services: ServiceItem[];
}) {
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
    knowsAbout: [
      "Webdesign",
      "Next.js",
      "React",
      "IT-Support",
      "Netzwerktechnik",
      "Cybersicherheit",
      "Microsoft 365",
      "Microsoft Azure",
      "DSGVO",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: catalogName,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          areaServed: "Berlin",
          provider: { "@id": `${SITE_URL}/#business` },
        },
      })),
    },
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
