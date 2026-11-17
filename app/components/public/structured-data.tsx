import type { BusinessSettings, Service } from "@/app/data/site-config";
import { phoneHref } from "@/app/lib/leads";

/**
 * JSON-LD LocalBusiness + прайс. Размечаем только те поля, что владелец реально
 * заполнил: выдуманные рейтинги и отзывы в разметку не попадают.
 */
export function StructuredData({ settings, services }: { settings: BusinessSettings; services: Service[] }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: settings.name,
    description: settings.heroSubtitle,
    telephone: phoneHref(settings.phone),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressCountry: "RU",
    },
    openingHours: settings.hours,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги детейлинг-студии",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name, description: service.description },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
          description: service.price,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Экранирование «<» защищает от инъекции через поля, которые правит владелец.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/</g, "\\u003c") }}
    />
  );
}
