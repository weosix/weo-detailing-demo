import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/**
 * metadataBase берётся из окружения: на проде это реальный домен, локально — localhost.
 * Захардкоженный localhost ломает абсолютные URL в Open Graph на деплое.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Детейлинг-студия WEO в Хамовниках — мойка, химчистка, полировка",
  description:
    "Мойка, химчистка салона и полировка кузова в Хамовниках. Осмотрим автомобиль, назовём точную цену до начала работ. Оставьте заявку или позвоните.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Детейлинг-студия WEO в Хамовниках",
    description: "Мойка, химчистка и полировка. Цену называем до начала работ.",
    locale: "ru_RU",
    type: "website",
    siteName: "WEO Detailing",
  },
  robots: {
    // Демо-шаблон не должен попадать в поиск до появления реального клиента.
    index: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_INDEXABLE === "true",
    follow: process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_INDEXABLE === "true",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
