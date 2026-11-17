"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { BusinessSettings, Lead, Service } from "@/app/data/site-config";
import { formatPreferredDate, isoDateIn, leadTimeOptions } from "@/app/data/site-config";
import type { LeadDraft, LeadErrors } from "@/app/lib/leads";
import { validateLead } from "@/app/lib/leads";

type BookingDialogProps = {
  services: Service[];
  settings: BusinessSettings;
  initialService?: Service;
  submittedLead: Lead | null;
  onSubmit: (draft: LeadDraft) => void;
  onClose: () => void;
};

export function BookingDialog({ services, settings, initialService, submittedLead, onSubmit, onClose }: BookingDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<LeadDraft>(() => ({
    name: "",
    phone: "",
    service: initialService?.name ?? services[0]?.name ?? "",
    preferredDate: isoDateIn(1),
    preferredTime: leadTimeOptions[0],
  }));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<LeadErrors>({});

  const consentRequired = (settings.consentText ?? "").trim() !== "";

  // Модальное окно: Escape, ловушка фокуса внутри формы и возврат фокуса на кнопку-источник.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = dialogRef.current;

    const focusables = () =>
      Array.from(
        node?.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Стартовый фокус — первое поле, а не крестик закрытия.
    window.setTimeout(() => node?.querySelector<HTMLElement>('[name="name"]')?.focus(), 30);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  // После ошибки фокус уходит на первое проблемное поле — так форма остаётся управляемой с клавиатуры.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const order: (keyof LeadDraft | "consent")[] = ["name", "phone", "service", "preferredDate", "preferredTime", "consent"];
    const firstInvalid = order.find((field) => errors[field]);
    if (!firstInvalid) return;
    dialogRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  }, [errors]);

  const update = (field: keyof LeadDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateLead(draft, { services, consentRequired, consentAccepted: consent });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({ ...draft, name: draft.name.trim(), phone: draft.phone.trim() });
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        className="booking-modal"
        ref={dialogRef}
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        {submittedLead ? (
          <div className="success-screen">
            <div className="check-mark" aria-hidden="true">
              ✓
            </div>
            <h2 id={titleId}>Заявка принята</h2>
            <p>
              Номер заявки #{String(submittedLead.id).slice(-5)}. Владелец свяжется с вами по телефону, чтобы
              подтвердить удобное время. Это ещё не подтверждённая запись.
            </p>
            <button type="button" className="primary-button" onClick={onClose}>
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <h2 id={titleId}>Оставить заявку</h2>
            <p className="booking-selected">
              Будем рады видеть: {draft.service || "выберите услугу"}
            </p>
            <p>Мастер свяжется с вами для подтверждения времени. Запись считается подтверждённой только после его ответа.</p>

            <label data-invalid={errors.name ? "true" : undefined}>
              Имя
              <input
                name="name"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${titleId}-name-error` : undefined}
              />
              {errors.name && (
                <span className="field-error" id={`${titleId}-name-error`}>
                  {errors.name}
                </span>
              )}
            </label>

            <label data-invalid={errors.phone ? "true" : undefined}>
              Телефон
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+7 999 123-45-67"
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? `${titleId}-phone-error` : undefined}
              />
              {errors.phone && (
                <span className="field-error" id={`${titleId}-phone-error`}>
                  {errors.phone}
                </span>
              )}
            </label>

            <label data-invalid={errors.service ? "true" : undefined}>
              Услуга
              <select name="service" value={draft.service} onChange={(event) => update("service", event.target.value)}>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name} · {service.price}
                  </option>
                ))}
              </select>
              {errors.service && <span className="field-error">{errors.service}</span>}
            </label>

            <div className="booking-row">
              <label data-invalid={errors.preferredDate ? "true" : undefined}>
                Желаемая дата
                <input
                  name="preferredDate"
                  type="date"
                  min={isoDateIn(0)}
                  value={draft.preferredDate}
                  onChange={(event) => update("preferredDate", event.target.value)}
                  aria-invalid={errors.preferredDate ? true : undefined}
                />
                {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
              </label>

              <label data-invalid={errors.preferredTime ? "true" : undefined}>
                Удобное время
                <select name="preferredTime" value={draft.preferredTime} onChange={(event) => update("preferredTime", event.target.value)}>
                  {leadTimeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.preferredTime && <span className="field-error">{errors.preferredTime}</span>}
              </label>
            </div>

            {consentRequired && (
              <label className="booking-consent" data-invalid={errors.consent ? "true" : undefined}>
                <input
                  name="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => {
                    setConsent(event.target.checked);
                    setErrors((current) => ({ ...current, consent: undefined }));
                  }}
                  aria-invalid={errors.consent ? true : undefined}
                />
                <span>{settings.consentText}</span>
              </label>
            )}
            {errors.consent && <span className="field-error">{errors.consent}</span>}

            <button type="submit">Отправить заявку</button>
            <p className="booking-hint">Стоимость работ согласуем заранее. Заявка ничего не оплачивает.</p>
          </>
        )}
      </form>
    </div>
  );
}

/** Компактная сводка последней заявки — показывается на странице после отправки формы. */
export function SubmittedLeadSummary({ lead, onBook }: { lead: Lead; onBook: () => void }) {
  return (
    <section className="desktop-submitted" aria-labelledby="submitted-heading">
      <div>
        <small>Заявка принята</small>
        <h2 id="submitted-heading">#{String(lead.id).slice(-5)} · {lead.service}</h2>
        <p>
          {formatPreferredDate(lead.preferredDate)}, {lead.preferredTime}. Владелец свяжется по телефону {lead.phone}, чтобы
          подтвердить время.
        </p>
      </div>
      <button type="button" onClick={onBook}>
        Новая заявка
      </button>
    </section>
  );
}
