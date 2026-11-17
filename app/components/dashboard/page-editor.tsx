"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BusinessSettings } from "@/app/data/site-config";

type PageEditorProps = {
  settings: BusinessSettings;
  onSave: (settings: BusinessSettings) => string;
};

type FieldKey = keyof BusinessSettings;

const fields: { key: FieldKey; label: string; type?: "text" | "tel" | "textarea"; hint?: string }[] = [
  { key: "name", label: "Название студии" },
  { key: "city", label: "Город" },
  { key: "district", label: "Район" },
  { key: "phone", label: "Телефон", type: "tel" },
  { key: "address", label: "Адрес" },
  { key: "hours", label: "Часы работы" },
  { key: "messengerPhone", label: "WhatsApp, номер в международном формате", type: "tel" },
  { key: "heroTitle", label: "Заголовок первого экрана", type: "textarea" },
  { key: "heroSubtitle", label: "Описание первого экрана", type: "textarea" },
  { key: "consentText", label: "Текст согласия на обработку данных", type: "textarea", hint: "Пустое поле — чекбокс согласия не показывается." },
  { key: "heroImage", label: "URL фотографии автомобиля" },
];

export function PageEditor({ settings, onSave }: PageEditorProps) {
  const [draft, setDraft] = useState<BusinessSettings>(settings);
  const [notice, setNotice] = useState("");
  const latest = useRef(settings);

  // Сохранённые настройки приходят новым объектом — обновляем черновик.
  useEffect(() => {
    if (latest.current !== settings) {
      latest.current = settings;
      setDraft(settings);
    }
  }, [settings]);

  const update = (key: FieldKey, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
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
          <h2>Публичная страница</h2>
          <p>Контакты, тексты и фото, которые увидят клиенты.</p>
        </div>
        <button className="owner-save" type="submit">
          Сохранить изменения
        </button>
      </div>

      {notice && (
        <div className="owner-notice" role="status">
          ✓ {notice}
        </div>
      )}

      <div className="owner-page-grid">
        {fields.map((field) => (
          <label key={field.key} className={field.type === "textarea" ? "owner-field-wide" : undefined}>
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                rows={3}
                value={draft[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
              />
            ) : (
              <input
                type={field.type ?? "text"}
                value={draft[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
              />
            )}
            {field.hint && <small>{field.hint}</small>}
          </label>
        ))}
      </div>

      <div className="owner-image-preview">
        <Image src={draft.heroImage} alt="Предпросмотр фото автомобиля" width={150} height={86} unoptimized />
        <div>
          <b>Главное фото</b>
          <small>Так блок будет выглядеть на первом экране. Загрузка файлов появится вместе с хранилищем.</small>
        </div>
      </div>
    </form>
  );
}
