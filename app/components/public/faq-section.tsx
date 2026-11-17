"use client";

import { faqItems } from "@/app/data/site-config";

/**
 * FAQ вместо дублирующих друг друга «преимуществ»: это вопросы, которые
 * на самом деле задают по телефону. Нативные <details> — работают без JS.
 */
export function FaqSection() {
  if (faqItems.length === 0) return null;

  return (
    <section className="desktop-faq" aria-labelledby="faq-heading">
      <div>
        <h2 id="faq-heading">Частые вопросы</h2>
      </div>
      <div className="desktop-faq-list">
        {faqItems.map((item) => (
          <details key={item.question} className="desktop-faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
