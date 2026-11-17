"use client";

import type { Lead } from "@/app/data/site-config";
import { formatPreferredDate } from "@/app/data/site-config";
import { phoneHref, sortLeads } from "@/app/lib/leads";

type LeadsPanelProps = {
  leads: Lead[];
  onAdvanceStatus: (id: number) => void;
};

export function LeadsPanel({ leads, onAdvanceStatus }: LeadsPanelProps) {
  const ordered = sortLeads(leads);

  return (
    <section className="owner-panel">
      <div className="owner-panel-head">
        <div>
          <h2>Последние обращения</h2>
          <p>Нажмите статус, чтобы перевести заявку на следующий этап.</p>
        </div>
      </div>
      {ordered.length === 0 ? (
        <div className="owner-empty">
          <b>Заявок пока нет</b>
          <p>Новые обращения с сайта появятся здесь.</p>
        </div>
      ) : (
        <div className="owner-table-wrap">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Услуга</th>
                <th>Желаемое время</th>
                <th>Телефон</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <b>{lead.name}</b>
                    <small>Заявка #{String(lead.id).slice(-5)}</small>
                  </td>
                  <td>{lead.service}</td>
                  <td>
                    {formatPreferredDate(lead.preferredDate)}
                    <small>{lead.preferredTime}</small>
                  </td>
                  <td>
                    <a href={`tel:${phoneHref(lead.phone)}`}>{lead.phone}</a>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`owner-status ${statusClass(lead.status)}`}
                      onClick={() => onAdvanceStatus(lead.id)}
                      title="Следующий этап"
                    >
                      {lead.status}
                      <span aria-hidden="true">⌄</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function statusClass(status: Lead["status"]): string {
  if (status === "Новая") return "is-new";
  if (status === "Связались") return "is-contacted";
  return "is-confirmed";
}
