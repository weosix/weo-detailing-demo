"use client";

import { businessBenefits, type Review } from "@/app/data/site-config";

export function ProofSection() {
  return (
    <section className="desktop-local-proof" aria-labelledby="proof-heading">
      <div className="desktop-proof-card">
        <div className="desktop-proof-lead">
          <h2 id="proof-heading">Цену не меняем на ходу</h2>
          <p>
            Стоимость зависит от состояния автомобиля, поэтому точную сумму называем после осмотра — и держим её
            до конца работ.
          </p>
        </div>
        <ul className="desktop-benefits">
          {businessBenefits.map((benefit) => (
            <li key={benefit}>
              <span aria-hidden="true">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Отзывы показываются только при наличии настоящих: пустой список
 * не рендерится вовсе, чтобы не создавать ложного доверия.
 */
export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  return (
    <section className="desktop-reviews" aria-labelledby="reviews-heading">
      <div className="desktop-local-head">
        <div>
          <h2 id="reviews-heading">Отзывы клиентов</h2>
        </div>
      </div>
      <div className="desktop-review-grid">
        {reviews.map((review) => (
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
  );
}
