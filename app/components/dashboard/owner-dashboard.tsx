"use client";

import type { BusinessSettings, Lead, Service } from "@/app/data/site-config";
import { LeadsPanel } from "@/components/dashboard/leads-panel";
import { PageEditor } from "@/components/dashboard/page-editor";
import { ServicesEditor } from "@/components/dashboard/services-editor";

export type AdminSection = "overview" | "services" | "page";

const headings: Record<AdminSection, string> = {
  overview: "Заявки",
  services: "Услуги и цены",
  page: "Страница студии",
};

const descriptions: Record<AdminSection, string> = {
  overview: "Новые обращения и состояние записи.",
  services: "Обновите прайс — изменения сразу попадут на публичную страницу.",
  page: "Управляйте контактами, текстами и главным изображением.",
};

type OwnerDashboardProps = {
  leads: Lead[];
  services: Service[];
  settings: BusinessSettings;
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onAdvanceLead: (id: number) => void;
  onSaveServices: (services: Service[]) => string;
  onSaveSettings: (settings: BusinessSettings) => string;
  onOpenSite: () => void;
};

export function OwnerDashboard({
  leads,
  services,
  settings,
  section,
  onSectionChange,
  onAdvanceLead,
  onSaveServices,
  onSaveSettings,
  onOpenSite,
}: OwnerDashboardProps) {
  const newLeads = leads.filter((lead) => lead.status === "Новая").length;

  return (
    <main className="owner-admin">
      <aside className="owner-sidebar">
        <a className="owner-brand" href="#owner">
          <span className="brand-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <b>Кабинет</b>
        </a>
        <div className="owner-shop">
          <span className="owner-shop-mark" aria-hidden="true">
            {settings.name.trim().charAt(0).toUpperCase() || "С"}
          </span>
          <div>
            <b>{settings.name}</b>
            <small>Детейлинг-студия</small>
          </div>
        </div>
        <nav className="owner-nav" aria-label="Разделы кабинета">
          {(Object.keys(headings) as AdminSection[]).map((item) => (
            <button key={item} type="button" className={section === item ? "active" : ""} onClick={() => onSectionChange(item)}>
              <span className="owner-nav-mark" aria-hidden="true">
                {item === "overview" ? "▤" : item === "services" ? "◇" : "⌘"}
              </span>
              {headings[item]}
              {item === "overview" && newLeads > 0 && <span className="owner-badge">{newLeads}</span>}
            </button>
          ))}
        </nav>
        <div className="owner-sidebar-foot">
          <span className="owner-live-dot" aria-hidden="true" />
          Демо · данные хранятся в этой вкладке
        </div>
      </aside>

      <section className="owner-main">
        <header className="owner-topbar">
          <div>
            <small>Кабинет владельца</small>
            <p>Управление автосервисом</p>
          </div>
          <button type="button" className="owner-preview" onClick={onOpenSite}>
            ← <span>Открыть сайт</span>
          </button>
        </header>

        <div className="owner-content">
          <div className="owner-heading">
            <div>
              <span className="owner-eyebrow">Кабинет владельца</span>
              <h1>{headings[section]}</h1>
              <p>{descriptions[section]}</p>
            </div>
          </div>

          {section === "overview" && (
            <>
              <div className="owner-kpis">
                <article>
                  <span>Новые обращения</span>
                  <strong>{newLeads}</strong>
                  <small>Ждут ответа владельца</small>
                </article>
                <article>
                  <span>Всего заявок</span>
                  <strong>{leads.length}</strong>
                  <small>Входящие обращения</small>
                </article>
                <article>
                  <span>Услуг в прайсе</span>
                  <strong>{services.length}</strong>
                  <small>Доступны клиентам</small>
                </article>
              </div>
              <LeadsPanel leads={leads} onAdvanceStatus={onAdvanceLead} />
            </>
          )}

          {section === "services" && <ServicesEditor services={services} onSave={onSaveServices} />}
          {section === "page" && <PageEditor settings={settings} onSave={onSaveSettings} />}
        </div>
      </section>
    </main>
  );
}
