"use client";

import Image from "next/image";
import { useRef } from "react";
import type { BusinessSettings, Lead, Review, Service } from "@/app/data/site-config";
import { formatPreferredDate } from "@/app/data/site-config";
import { phoneHref, whatsappHref } from "@/app/lib/leads";
import { priceLabel } from "@/app/lib/services";
import { FaqSection } from "@/components/public/faq-section";

/**
 * Мобильная версия повторяет структуру и содержание desktop-страницы:
 * те же блоки, тот же честный текст, тот же функционал заявки и звонка.
 * Отличается только компоновка — одна колонка с крупными tap-targets.
 */
type MobileHomeProps = {
  settings: BusinessSettings;
  services: Service[];
  reviews: Review[];
  bookings?: Lead[];
  onBook: (service?: Service) => void;
  onOwnerLogin: () => void;
};

export function MobileHome({ settings, services, reviews, bookings = [], onBook, onOwnerLogin }: MobileHomeProps) {
  const lastTouchAction = useRef(0);
  const activate = (action: () => void) => {
    const now = Date.now();
    // Mobile Safari/Chrome can emit both touch/pointer and synthetic click.
    // Keep one activation per gesture while preserving normal keyboard clicks.
    if (now - lastTouchAction.current < 450) return;
    lastTouchAction.current = now;
    action();
  };
  const hasMap = (settings.mapUrl ?? "").trim() !== "";
  const mapQuery = encodeURIComponent(`${settings.city}, ${settings.address}`);
  const hasWhatsApp = (settings.messengerPhone ?? "").trim() !== "";
  const directions = (settings.directions ?? "").trim();
  // Защита от неполных пропсов: страница не должна падать из-за отсутствующего массива.
  const latest = bookings?.[0] ?? null;

  return (
    <main className="m-page">
      <header className="m-header">
        <a className="m-brand" href="#m-top">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <b>{settings.name}</b>
        </a>
        <a className="m-header-phone" href={`tel:${phoneHref(settings.phone)}`}>
          Позвонить
        </a>
      </header>

      {/* Первый экран */}
      <section className="m-hero" id="m-top">
        <div className="m-hero-photo">
          <Image
            src={settings.heroImage}
            alt={`Автомобиль в студии ${settings.name}`}
            fill
            priority
            sizes="100vw"
            className="m-hero-img"
          />
        </div>
        <h1>{settings.heroTitle}</h1>
        <p>{settings.heroSubtitle}</p>

        <dl className="m-facts">
          <div>
            <dt>Адрес</dt>
            <dd>
              {settings.district}
              <span>{settings.address}</span>
            </dd>
          </div>
          <div>
            <dt>Часы работы</dt>
            <dd>{settings.hours}</dd>
          </div>
        </dl>

        <div className="m-cta-row">
          <button
            type="button"
            className="m-cta-primary"
            onClick={() => activate(() => onBook())}
            onTouchEnd={(event) => {
              event.preventDefault();
              activate(() => onBook());
            }}
          >
            Оставить заявку
          </button>
          <a className="m-cta-secondary" href={`tel:${phoneHref(settings.phone)}`}>
            {settings.phone}
          </a>
        </div>
      </section>

      {/* Услуги */}
      <section className="m-section" id="m-services">
        <h2>Мойка, химчистка, полировка</h2>
        <p className="m-section-note">
          Цены указаны как «от»: итог зависит от размера автомобиля и степени загрязнения. Точную стоимость назовём до
          начала работ.
        </p>
        <div className="m-services">
          {(services ?? []).length > 0 ? (
            (services ?? []).map((service) => (
              <article className="m-service" key={service.name}>
                <div className="m-service-head">
                  <h3>{service.name}</h3>
                  <b>{priceLabel(service.price)}</b>
                </div>
                {service.description && <p>{service.description}</p>}
                <div className="m-service-foot">
                  {service.time && <span>{service.time}</span>}
                  <button
                    type="button"
                    onClick={() => activate(() => onBook(service))}
                    onTouchEnd={(event) => {
                      event.preventDefault();
                      activate(() => onBook(service));
                    }}
                  >
                    Выбрать услугу
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="m-section-note">Прайс пока не заполнен. Позвоните нам, чтобы узнать стоимость работ.</p>
          )}
        </div>
      </section>

      {/* Как устроена запись */}
      <section className="m-section">
        <h2>От заявки до выдачи машины</h2>
        <ol className="m-steps">
          <li>
            <strong>Оставляете заявку</strong>
            <p>Указываете услугу и удобную дату. Это заявка, а не подтверждённая запись.</p>
          </li>
          <li>
            <strong>Владелец перезванивает</strong>
            <p>Уточняем состояние автомобиля и называем цену. Приём — {settings.hours.toLowerCase()}.</p>
          </li>
          <li>
            <strong>Приезжаете и забираете машину</strong>
            <p>Выдаём в согласованное время и показываем, что сделали.</p>
          </li>
        </ol>
      </section>

      {/* Цену не меняем на ходу */}
      <section className="m-section">
        <div className="m-proof">
          <h2>Цену не меняем на ходу</h2>
          <p>
            Стоимость зависит от состояния автомобиля, поэтому точную сумму называем после осмотра — и держим её до
            конца работ.
          </p>
          <ul>
            <li>
              <span aria-hidden="true">✓</span>Итоговую стоимость называем до начала работ
            </li>
            <li>
              <span aria-hidden="true">✓</span>Дополнительную услугу не добавляем без вашего согласия
            </li>
            <li>
              <span aria-hidden="true">✓</span>Показываем результат при выдаче автомобиля
            </li>
          </ul>
        </div>
      </section>

      {/* Моя запись — только если в этой сессии что-то отправлено */}
      {latest && (
        <section className="m-section">
          <h2>Моя запись</h2>
          <article className="m-booking-card">
            <span className="m-booking-status">Заявка #{String(latest.id).slice(-5)} · {latest.status}</span>
            <h3>{latest.service}</h3>
            <p>
              {formatPreferredDate(latest.preferredDate)}, {latest.preferredTime}. Владелец свяжется по телефону{" "}
              {latest.phone}, чтобы подтвердить время.
            </p>
          </article>
        </section>
      )}

      {/* Отзывы — только настоящие */}
      {(reviews ?? []).length > 0 && (
        <section className="m-section">
          <h2>Отзывы клиентов</h2>
          <div className="m-reviews">
            {(reviews ?? []).map((review) => (
              <article key={`${review.name}-${review.text.slice(0, 12)}`}>
                <p>«{review.text}»</p>
                <footer>
                  <b>{review.name}</b>
                  <small>{review.service}</small>
                </footer>
              </article>
            ))}
          </div>
        </section>
      )}

      <FaqSection />

      {/* Контакты */}
      <section className="m-section m-contact" id="m-contact">
        <h2>Контакты</h2>
        <dl>
          <div>
            <dt>Адрес</dt>
            <dd>
              {settings.city}, {settings.district}
              <span>{settings.address}</span>
            </dd>
          </div>
          <div>
            <dt>Часы работы</dt>
            <dd>{settings.hours}</dd>
          </div>
          {directions !== "" && (
            <div>
              <dt>Как добраться</dt>
              <dd>{directions}</dd>
            </div>
          )}
        </dl>
        <div className="m-contact-actions">
          <a className="m-cta-primary" href={`tel:${phoneHref(settings.phone)}`}>
            {settings.phone}
          </a>
          <a
            className="m-cta-secondary"
            href={hasMap ? settings.mapUrl : `https://yandex.ru/maps/?text=${mapQuery}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {hasMap ? "Открыть на карте" : "Найти на карте"}
          </a>
          {hasWhatsApp && (
            <a
              className="m-cta-secondary"
              href={`https://wa.me/${whatsappHref(settings.messengerPhone)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Написать в WhatsApp
            </a>
          )}
        </div>
      </section>

      <footer className="m-footer">
        <span>
          {settings.name} · {settings.city}
        </span>
        <button type="button" className="m-owner-link" onClick={() => activate(onOwnerLogin)}>
          Вход для владельца
        </button>
      </footer>
    </main>
  );
}
