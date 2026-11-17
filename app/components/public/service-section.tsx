"use client";

import type { Service } from "@/app/data/site-config";
import { priceLabel } from "@/app/lib/services";

type ServiceSectionProps = {
  services: Service[];
  onBook: (service: Service) => void;
};

export function ServiceSection({ services, onBook }: ServiceSectionProps) {
  return (
    <section className="desktop-services" id="site-services" aria-labelledby="services-heading">
      <div className="desktop-section-title">
        <h2 id="services-heading">Мойка, химчистка, полировка</h2>
        <p>
          Цены указаны как «от»: итог зависит от размера автомобиля и степени загрязнения. Точную стоимость
          назовём до начала работ.
        </p>
      </div>

      {services.length > 0 ? (
        <div className="service-grid">
          {services.map((service) => (
            <article key={service.name}>
              <h3>{service.name}</h3>
              {service.description && <p>{service.description}</p>}
              <div className="service-meta">
                {service.time && <span>{service.time}</span>}
                <b>{priceLabel(service.price)}</b>
              </div>
              <button type="button" onClick={() => onBook(service)}>
                Выбрать услугу
              </button>
            </article>
          ))}
        </div>
      ) : (
        <p className="desktop-empty">Прайс пока не заполнен. Позвоните нам, чтобы узнать стоимость работ.</p>
      )}
    </section>
  );
}
