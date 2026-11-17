"use client";

import { phoneHref } from "@/app/lib/leads";

type SiteHeaderProps = {
  studioName: string;
  phone: string;
  onOwnerLogin: () => void;
};

export function SiteHeader({ studioName, phone, onOwnerLogin }: SiteHeaderProps) {
  return (
    <header className="desktop-header">
      <a className="desktop-brand" href="#site-home">
        <span className="brand-symbol" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <b>{studioName}</b>
      </a>
      <nav aria-label="Разделы страницы">
        <a href="#site-services">Услуги</a>
        <a href="#site-process">Как это работает</a>
        <a href="#site-contact">Контакты</a>
      </nav>
      {/* Для автосервиса звонок — основной способ связаться, поэтому телефон всегда в шапке. */}
      <a className="desktop-header-phone" href={`tel:${phoneHref(phone)}`}>
        {phone}
      </a>
      {/*
        Вход владельца — служебное действие, не клиентское: мелкая ссылка,
        чтобы не конкурировать с записью и звонком.
      */}
      <button type="button" className="desktop-owner-link" onClick={onOwnerLogin}>
        Вход для владельца
      </button>
    </header>
  );
}
