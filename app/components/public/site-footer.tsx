"use client";

import type { BusinessSettings } from "@/app/data/site-config";
import { phoneHref, whatsappHref } from "@/app/lib/leads";

type SiteFooterProps = {
  settings: BusinessSettings;
};

export function SiteFooter({ settings }: SiteFooterProps) {
  // Страховка от неполных данных: сохранённые настройки прошлых версий
  // могут не содержать новых полей, и страница не должна из-за этого падать.
  const hasMap = (settings.mapUrl ?? "").trim() !== "";
  const mapQuery = encodeURIComponent(`${settings.city}, ${settings.address}`);
  const directions = (settings.directions ?? "").trim();
  const hasWhatsApp = (settings.messengerPhone ?? "").trim() !== "";

  return (
    <footer className="desktop-footer" id="site-contact">
      <div className="desktop-footer-col">
        <h3>{settings.name}</h3>
        <p>
          {settings.city}, {settings.district}
          <br />
          {settings.address}
        </p>
        {directions !== "" && <p className="desktop-footer-note">{directions}</p>}
      </div>

      <div className="desktop-footer-col">
        <h3>Когда приехать</h3>
        <p>{settings.hours}</p>
        <p className="desktop-footer-note">
          За химчисткой или полировкой лучше звонить заранее: в день работ автомобиль остаётся в студии.
        </p>
      </div>

      <div className="desktop-footer-col">
        <h3>Связаться</h3>
        <p>
          <a className="desktop-footer-phone" href={`tel:${phoneHref(settings.phone)}`}>
            {settings.phone}
          </a>
        </p>
        <p>
          <a
            href={hasMap ? settings.mapUrl : `https://yandex.ru/maps/?text=${mapQuery}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {hasMap ? "Открыть на карте" : "Найти на карте"}
          </a>
        </p>
        {/* Ссылка на WhatsApp выводится только если владелец её заполнил. */}
        {hasWhatsApp && (
          <p>
            <a href={`https://wa.me/${whatsappHref(settings.messengerPhone)}`} rel="noopener noreferrer" target="_blank">
              Написать в WhatsApp
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
