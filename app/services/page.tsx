import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { ContactForm } from "@/app/components/ContactForm";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { ServiceCard } from "@/app/components/ServiceCard";
import { services } from "@/app/content/services";

export const metadata: Metadata = { title: "IT Services", description: "Explore remote support, device management, email, backup, Wi-Fi, and cybersecurity services for small businesses." };

export default function ServicesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Services" title="Complete IT support for the way a small business works." description="Choose help for one immediate need or connect the services into a reliable day-to-day support plan." image="/images/services-overview.webp" imageAlt="IT specialist working with a small-business team" />
      <section className="section service-directory">
        <div className="shell">
          <Reveal className="section-heading split-heading"><div><p className="eyebrow">Explore every service</p><h2>Practical support from first setup to ongoing care.</h2></div><p>Each service is explained in business terms, with clear inclusions, outcomes, and next steps. Start where the need is most obvious.</p></Reveal>
          <div className="service-grid swipe-row">{services.map((service, index) => <Reveal key={service.slug} delay={(index % 3) * 60}><ServiceCard service={service} index={index} /></Reveal>)}</div>
        </div>
      </section>
      <section className="section plan-callout">
        <div className="shell plan-callout-grid">
          <Reveal><p className="eyebrow">Not sure where to begin?</p><h2>Start with the business problem, not a technical label.</h2><p>Tell us what is unreliable, difficult, or taking too much time. We will help identify the most sensible service and avoid unnecessary work.</p><ul className="check-list"><li><CheckCircle2 /> No obligation to choose a plan first</li><li><CheckCircle2 /> Clear scope before project work begins</li><li><CheckCircle2 /> Recommendations matched to your team size</li></ul></Reveal>
          <Reveal className="form-panel" delay={100}><ContactForm compact /></Reveal>
        </div>
      </section>
    </main>
  );
}
