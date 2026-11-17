import type { MetadataRoute } from "next";

/**
 * Демо-шаблон не индексируется, пока не появится реальный клиент.
 * Для публикации конкретной студии: NEXT_PUBLIC_INDEXABLE=true и NEXT_PUBLIC_SITE_URL.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005";

  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
