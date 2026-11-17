"use client";

import type { BusinessSettings } from "@/app/data/site-config";

export function ProcessSection({ settings }: { settings: BusinessSettings }) {
  // Тексты описывают реальный процесс: заявка → звонок → согласование → визит.
  const steps = [
    { title: "Оставляете заявку", text: "Указываете услугу и удобную дату. Это заявка, а не подтверждённая запись." },
    { title: "Владелец перезванивает", text: `Уточняем состояние автомобиля и называем цену. Приём — ${settings.hours.toLowerCase()}.` },
    { title: "Приезжаете и забираете машину", text: "Выдаём в согласованное время и показываем, что сделали." },
  ];

  return (
    <section className="desktop-process" id="site-process" aria-labelledby="process-heading">
      <div>
        <small>Как устроена запись</small>
        <h2 id="process-heading">От заявки до выдачи машины.</h2>
      </div>
      <ol className="process-grid">
        {steps.map((step, index) => (
          <li key={step.title}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <strong>{step.title}</strong>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
