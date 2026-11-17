import type { BusinessSettings, Lead, LeadStatus, Service } from "@/app/data/site-config";
import { LEAD_STATUS_FLOW } from "@/app/data/site-config";

/** Форма заявки: то, что клиент заполняет в диалоге. */
export type LeadDraft = {
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
};

export type LeadField = keyof LeadDraft | "consent" | "service";
export type LeadErrors = Partial<Record<LeadField, string>>;

/** Следующий этап обработки при клике по статусу в кабинете: Новая → Связались → Подтверждена → Новая. */
export function nextLeadStatus(status: LeadStatus): LeadStatus {
  const index = LEAD_STATUS_FLOW.indexOf(status);
  return LEAD_STATUS_FLOW[(index + 1) % LEAD_STATUS_FLOW.length];
}

/** Оставляем в номере только цифры и «+» для ссылок tel:. */
export function phoneHref(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/** wa.me принимает номер без знака «+» и разделителей. */
export function whatsappHref(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Проверка заявки. Сейчас работает на клиенте, но написана без зависимостей от React,
 * чтобы тот же код вызывал серверный route handler, когда появится сохранение.
 */
export function validateLead(
  draft: LeadDraft,
  options: { services: Service[]; consentRequired: boolean; consentAccepted: boolean },
): LeadErrors {
  const errors: LeadErrors = {};

  const name = draft.name.trim();
  if (name.length < 2) errors.name = "Укажите, как к вам обращаться";
  else if (name.length > 80) errors.name = "Слишком длинное имя";

  const digits = draft.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 11) errors.phone = "Нужен номер из 10–11 цифр";

  if (!options.services.some((service) => service.name === draft.service)) {
    errors.service = "Выберите услугу из прайса";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.preferredDate)) {
    errors.preferredDate = "Укажите желаемую дату";
  }

  if (!draft.preferredTime) errors.preferredTime = "Укажите удобное время";

  if (options.consentRequired && !options.consentAccepted) {
    errors.consent = "Без согласия на обработку данных мы не сможем связаться";
  }

  return errors;
}

/** Заголовок вкладки и SEO-описание для страницы студии. */
export function studioTitle(settings: BusinessSettings): string {
  return `${settings.name} — детейлинг-студия в ${settings.city}`;
}

export function studioDescription(settings: BusinessSettings): string {
  return `${settings.heroSubtitle} ${settings.district}, ${settings.address}. Звоните ${settings.phone} или оставьте заявку.`;
}

/** Порядок заявок в кабинете: сначала необработанные, затем самые свежие. */
export function sortLeads(leads: Lead[]): Lead[] {
  const weight = (status: LeadStatus) => LEAD_STATUS_FLOW.indexOf(status);
  return [...leads].sort((a, b) => weight(a.status) - weight(b.status) || b.id - a.id);
}
