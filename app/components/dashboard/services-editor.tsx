"use client";

import { useEffect, useRef, useState } from "react";
import type { Service } from "@/app/data/site-config";

type ServicesEditorProps = {
  services: Service[];
  onSave: (services: Service[]) => string;
};

export function ServicesEditor({ services, onSave }: ServicesEditorProps) {
  const [draft, setDraft] = useState<Service[]>(services);
  const [notice, setNotice] = useState("");
  const latest = useRef(services);

  // Сохранённые данные приходят новым массивом (в т.ч. из localStorage) — подхватываем черновик.
  useEffect(() => {
    if (latest.current !== services) {
      latest.current = services;
      setDraft(services);
    }
  }, [services]);

  const updateField = (index: number, field: keyof Service, value: string) => {
    setDraft((items) => items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
    setNotice("");
  };

  return (
    <form
      className="owner-panel owner-edit-form"
      onSubmit={(event) => {
        event.preventDefault();
        setNotice(onSave(draft));
      }}
    >
      <div className="owner-panel-head">
        <div>
          <h2>Прайс-лист</h2>
          <p>Название, цена, длительность и краткое описание видит клиент на сайте.</p>
        </div>
        <button className="owner-save" type="submit">
          Сохранить прайс
        </button>
      </div>

      {notice && (
        <div className="owner-notice" role="status">
          ✓ {notice}
        </div>
      )}

      <div className="owner-service-edit-list">
        {draft.map((service, index) => (
          <fieldset className="owner-service-edit" key={index}>
            <legend className="owner-service-number">{String(index + 1).padStart(2, "0")}</legend>
            <label>
              Название
              <input value={service.name} onChange={(event) => updateField(index, "name", event.target.value)} />
            </label>
            <label>
              Цена
              <input value={service.price} onChange={(event) => updateField(index, "price", event.target.value)} />
            </label>
            <label>
              Время
              <input value={service.time} onChange={(event) => updateField(index, "time", event.target.value)} />
            </label>
            <label>
              Описание
              <input value={service.description ?? ""} onChange={(event) => updateField(index, "description", event.target.value)} />
            </label>
            <button
              type="button"
              className="owner-remove"
              aria-label={`Удалить услугу «${service.name}»`}
              onClick={() => {
                setDraft((items) => items.filter((_, itemIndex) => itemIndex !== index));
                setNotice("");
              }}
            >
              ×
            </button>
          </fieldset>
        ))}
      </div>

      <button
        type="button"
        className="owner-add-service"
        onClick={() => {
          setDraft((items) => [...items, { name: "Новая услуга", price: "от 0 ₽", time: "1 ч", icon: "◇", description: "" }]);
          setNotice("");
        }}
      >
        ＋ Добавить услугу
      </button>
    </form>
  );
}
