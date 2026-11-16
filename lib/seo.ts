import { FAQS, SITE } from "@/lib/site";

export const SITE_URL = `https://${SITE.domain}`;

// What Google shows: the words people search with first ("car garage", "detailing", "Kukatpally"), the name last.
export const TITLE = "Car Garage & Detailing in Kukatpally, Hyderabad | 9M Car Care";
export const DESCRIPTION =
  "9M Car Care, KPHB Colony, Kukatpally: car servicing, repairs, PPF, ceramic, graphene and Teflon coating, deep cleaning and detailing. WhatsApp 87902 33253.";

const SERVICES_OFFERED = [
  "Car servicing",
  "Car repairs",
  "Car detailing",
  "Paint protection film (PPF)",
  "Ceramic coating",
  "Graphene coating",
  "Teflon coating",
  "Deep cleaning",
];

/** Structured data for Google: the business (a car garage at this address), the site, and the questions answered on
 *  the page. Ratings, opening hours and prices are left out until the owner confirms real ones. */
export function homeJsonLd() {
  const business = `${SITE_URL}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRepair",
        "@id": business,
        name: SITE.name,
        description: DESCRIPTION,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-9m.jpg`,
        image: [`${SITE_URL}/media/mustang/hero.jpg`],
        telephone: SITE.phones[0].tel,
        contactPoint: SITE.phones.map((p) => ({ "@type": "ContactPoint", telephone: p.tel, contactType: "customer service", areaServed: "IN" })),
        address: {
          "@type": "PostalAddress",
          streetAddress: "LIG-108, 15th Phase, KPHB Colony, near Kaithalapur Junction",
          addressLocality: "Kukatpally, Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500085",
          addressCountry: "IN",
        },
        hasMap: SITE.maps,
        sameAs: [SITE.instagram],
        areaServed: [
          { "@type": "Place", name: "KPHB Colony" },
          { "@type": "Place", name: "Kukatpally" },
          { "@type": "City", name: "Hyderabad" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Car care services",
          itemListElement: SERVICES_OFFERED.map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
        },
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE.name, url: `${SITE_URL}/`, inLanguage: "en-IN", publisher: { "@id": business } },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so no string can close the tag. */
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
