import type { Service } from "@/app/data/site-config";

/** Услуга, открываемая по умолчанию: первая в прайсе или пустая заглушка. */
export function defaultService(services: Service[]): Service {
  return services[0] ?? { name: "Консультация", price: "по запросу", time: "—", icon: "◇" };
}

/** «от 3 500 ₽» остаётся как есть, «3 500 ₽» получает префикс «от». */
export function withFromPrefix(price: string): string {
  const trimmed = price.trim();
  if (!trimmed) return "по запросу";
  return /^(от|до|по)/i.test(trimmed) ? trimmed : `от ${trimmed}`;
}

/** Подпись цены для карточек услуг: используется и на desktop, и на мобильном. */
export const priceLabel = withFromPrefix;
