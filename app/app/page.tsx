"use client";

import { useCallback, useEffect, useState } from "react";
import {
  businessDefaults,
  demoLeads,
  demoReviews,
  serviceDefaults,
  type BusinessSettings,
  type Lead,
  type Service,
} from "@/app/data/site-config";
import { nextLeadStatus } from "@/app/lib/leads";
import { defaultService } from "@/app/lib/services";
import { MobileHome } from "@/components/mobile/mobile-home";
import type { AdminSection } from "@/components/dashboard/owner-dashboard";
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard";
import { OwnerLogin } from "@/components/dashboard/owner-login";
import { DesktopLanding } from "@/components/public/desktop-landing";
import { BookingDialog } from "@/components/public/booking-dialog";
import { StructuredData } from "@/components/public/structured-data";
import { useLocalDraft } from "@/components/use-demo-storage";

/** PIN для демо-кабинета. Перед публикацией заменяется серверной авторизацией. */
const DEMO_OWNER_PIN = "4726";

export default function Home() {
  // Данные демо живут в localStorage: правки владельца и заявки не теряются при перезагрузке.
  const [settings, setSettings] = useLocalDraft<BusinessSettings>("weo.settings", businessDefaults);
  const [services, setServices] = useLocalDraft<Service[]>("weo.services", serviceDefaults);
  const [leads, setLeads] = useLocalDraft<Lead[]>("weo.leads", demoLeads);

  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);
  const [ownerLoginOpen, setOwnerLoginOpen] = useState(false);
  const [adminSection, setAdminSection] = useState<AdminSection>("overview");
  const [booking, setBooking] = useState<{ open: boolean; service?: Service }>({ open: false });
  const [lastLead, setLastLead] = useState<Lead | null>(null);

  // Флаг успеха живёт только внутри одной сессии диалога: закрыли — при следующем
  // открытии снова видна форма, а не чужая старая заявка.
  const [dialogSubmitted, setDialogSubmitted] = useState<Lead | null>(null);

  const closeBooking = useCallback(() => {
    setBooking({ open: false });
    setDialogSubmitted(null);
  }, []);

  // Пока открыт диалог заявки, страница под ним не скроллится.
  useEffect(() => {
    if (!booking.open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [booking.open]);

  const openBooking = (service?: Service) => {
    setDialogSubmitted(null);
    setBooking({ open: true, service: service ?? defaultService(services) });
  };

  const submitLead = (lead: Lead) => {
    setLeads((items) => [lead, ...items]);
    setLastLead(lead);
    // Диалог переключается на экран успеха: повторная отправка той же заявки невозможна.
    setDialogSubmitted(lead);
  };

  const advanceLead = (id: number) => {
    setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, status: nextLeadStatus(lead.status) } : lead)));
  };

  const saveServices = (next: Service[]) => {
    setServices(next);
    return `Прайс сохранён · ${next.length} услуг`;
  };

  const saveSettings = (next: BusinessSettings) => {
    setSettings(next);
    return "Страница сохранена";
  };

  if (ownerLoggedIn) {
    return (
      <OwnerDashboard
        leads={leads}
        services={services}
        settings={settings}
        section={adminSection}
        onSectionChange={setAdminSection}
        onAdvanceLead={advanceLead}
        onSaveServices={saveServices}
        onSaveSettings={saveSettings}
        onOpenSite={() => setOwnerLoggedIn(false)}
      />
    );
  }

  return (
    <>
      {ownerLoginOpen && (
        <OwnerLogin
          expectedPin={DEMO_OWNER_PIN}
          onUnlock={() => {
            setOwnerLoginOpen(false);
            setAdminSection("overview");
            setOwnerLoggedIn(true);
          }}
          onClose={() => setOwnerLoginOpen(false)}
        />
      )}

      <StructuredData settings={settings} services={services} />
      <DesktopLanding
        settings={settings}
        services={services}
        reviews={demoReviews}
        lastLead={lastLead}
        onBook={openBooking}
        onOwnerLogin={() => setOwnerLoginOpen(true)}
      />

      <MobileHome
        settings={settings}
        services={services}
        reviews={demoReviews}
        // На телефоне показываем только что отправленную заявку — не демо-заявки из кабинета.
        bookings={lastLead ? [lastLead] : []}
        onBook={openBooking}
        onOwnerLogin={() => setOwnerLoginOpen(true)}
      />

      {booking.open && (
        <BookingDialog
          key={`${booking.service?.name ?? "default"}-${dialogSubmitted?.id ?? "new"}`}
          services={services}
          settings={settings}
          initialService={booking.service}
          submittedLead={dialogSubmitted}
          onSubmit={(draft) => {
            submitLead({
              id: Date.now(),
              name: draft.name,
              phone: draft.phone,
              service: draft.service,
              preferredDate: draft.preferredDate,
              preferredTime: draft.preferredTime,
              status: "Новая",
              createdAt: new Date().toISOString(),
            });
          }}
          onClose={closeBooking}
        />
      )}
    </>
  );
}
