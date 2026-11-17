"use client";

import Image from "next/image";
import type { BusinessSettings } from "@/app/data/site-config";
import { phoneHref } from "@/app/lib/leads";

type SiteHeroProps = {
  settings: BusinessSettings;
  onBook: () => void;
};

export function SiteHero({ settings, onBook }: SiteHeroProps) {
  return (
    <section className="desktop-hero" id="site-home">
      <div className="desktop-copy">
        <h1>{settings.heroTitle}</h1>
        <p>{settings.heroSubtitle}</p>

        {/*
          Первый экран должен отвечать на «что, где, что делать».
          Здесь только данные владельца — адрес, район, часы, телефон.
        */}
        <dl className="desktop-facts">
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

        <div className="desktop-actions">
          <button type="button" onClick={onBook}>
            Оставить заявку
          </button>
          <span className="desktop-call">
            <a href={`tel:${phoneHref(settings.phone)}`}>{settings.phone}</a>
            <small>или позвоните — ответим в рабочее время</small>
          </span>
        </div>
      </div>

      <figure className="desktop-art">
        <Image
          className="hero-car-photo"
          src={settings.heroImage}
          alt={`Автомобиль в студии ${settings.name}`}
          fill
          priority
          sizes="(min-width: 900px) 45vw, 100vw"
        />
        <figcaption className="desktop-art-caption">
          Фото студии. Работы клиентов показываем по согласию владельцев автомобилей.
        </figcaption>
      </figure>
    </section>
  );
}
