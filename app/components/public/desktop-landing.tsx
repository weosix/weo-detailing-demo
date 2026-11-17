"use client";

import type { BusinessSettings, Lead, Review, Service } from "@/app/data/site-config";
import { SubmittedLeadSummary } from "@/components/public/booking-dialog";
import { FaqSection } from "@/components/public/faq-section";
import { ProcessSection } from "@/components/public/process-section";
import { ProofSection, ReviewsSection } from "@/components/public/proof-section";
import { ServiceSection } from "@/components/public/service-section";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { SiteHero } from "@/components/public/site-hero";

type DesktopLandingProps = {
  settings: BusinessSettings;
  services: Service[];
  reviews: Review[];
  lastLead: Lead | null;
  /** Заявка уже отправлена в текущей сессии диалога — показываем экран успеха. */
  onBook: (service?: Service) => void;
  onOwnerLogin: () => void;
};

export function DesktopLanding({
  settings,
  services,
  reviews,
  lastLead,
  onBook,
  onOwnerLogin,
}: DesktopLandingProps) {
  return (
    <main className="desktop-home" id="site-main">
      <a className="skip-link" href="#site-services">
        Перейти к услугам
      </a>
      <SiteHeader studioName={settings.name} phone={settings.phone} onOwnerLogin={onOwnerLogin} />
      <SiteHero settings={settings} onBook={() => onBook()} />
      {lastLead && (
        <SubmittedLeadSummary
          lead={lastLead}
          onBook={() => onBook(services.find((service) => service.name === lastLead.service))}
        />
      )}
      <ServiceSection services={services} onBook={onBook} />
      <ProcessSection settings={settings} />
      <ProofSection />
      <ReviewsSection reviews={reviews} />
      <FaqSection />
      <SiteFooter settings={settings} />
    </main>
  );
}
