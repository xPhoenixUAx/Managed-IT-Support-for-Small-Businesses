import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight, CircleCheckBig, Mail } from "lucide-react";
import { ContactForm } from "@/app/components/ContactForm";
import { Reveal } from "@/app/components/Reveal";
import { ServiceIcon } from "@/app/components/ServiceIcon";
import { siteConfig } from "@/app/config/site-config";
import { getService, services } from "@/app/content/services";

export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return { title: service.title, description: service.summary };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const currentIndex = services.findIndex((item) => item.slug === service.slug);
  const nextService = services[(currentIndex + 1) % services.length];

  return (
    <main id="main-content">
      <section className="service-hero">
        <div className="service-hero-image"><Image unoptimized src={service.image} alt={`${service.title} for small-business teams`} fill priority sizes="100vw" /></div>
        <div className="service-hero-panel">
          <Reveal>
            <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><Link href="/services">Services</Link><ChevronRight size={14} /><span>{service.title}</span></nav>
            <div className="service-hero-icon"><ServiceIcon name={service.icon} size={28} /></div>
            <p className="eyebrow">{service.eyebrow}</p>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <Link className="button button-primary" href="#request">Ask about this service <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
        <div className="service-index">{String(currentIndex + 1).padStart(2, "0")}<span>/ {String(services.length).padStart(2, "0")}</span></div>
      </section>

      <section className="section service-intro">
        <div className="shell service-intro-grid">
          <Reveal><p className="eyebrow">What this service solves</p><h2>A practical setup your team can use with confidence.</h2></Reveal>
          <Reveal delay={80}><p className="large-copy">{service.description}</p><div className="service-contact-line"><Mail /><span>Questions before you begin?</span><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></div></Reveal>
        </div>
      </section>

      <section className="section service-included">
        <div className="shell detail-grid">
          <Reveal className="detail-panel dark-panel"><p className="eyebrow">What is included</p><h2>Focused support, clearly scoped.</h2><ul className="feature-list">{service.included.map((item) => <li key={item}><Check />{item}</li>)}</ul></Reveal>
          <Reveal className="detail-panel outcome-panel" delay={90}><p className="eyebrow">Business outcomes</p><h2>What improves for your team.</h2><div className="outcome-list">{service.outcomes.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></Reveal>
        </div>
      </section>

      <section className="section service-process">
        <div className="shell">
          <Reveal className="section-heading centered-heading"><p className="eyebrow">How the work moves forward</p><h2>Three clear stages, with no mystery in the middle.</h2></Reveal>
          <div className="process-grid">{service.process.map((step, index) => <Reveal className="process-card" key={step.title} delay={index * 80}><span className="process-number">{String(index + 1).padStart(2, "0")}</span><div className="process-icon"><CircleCheckBig /></div><h3>{step.title}</h3><p>{step.text}</p>{index < service.process.length - 1 && <ChevronRight className="process-arrow" />}</Reveal>)}</div>
        </div>
      </section>

      <section className="section service-fit">
        <div className="shell service-fit-grid">
          <Reveal className="fit-copy"><p className="eyebrow">A good fit for</p><h2>Support designed around real small-business conditions.</h2><ul className="check-list">{service.idealFor.map((item) => <li key={item}><Check />{item}</li>)}</ul><Link className="button button-primary" href="#request">Discuss your situation <ArrowRight size={18} /></Link></Reveal>
          <Reveal className="fit-faq" delay={80}><p className="eyebrow">Common questions</p>{service.faq.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</Reveal>
        </div>
      </section>

      <section className="section request-section" id="request">
        <div className="shell request-grid">
          <Reveal><p className="eyebrow">Request {service.title}</p><h2>Tell us what you need to improve.</h2><p>Describe the team, current setup, issue, or result you want. We will reply by email with focused questions and a practical next step.</p><p className="safety-note"><strong>Please do not send passwords or verification codes.</strong> We will never ask for them through this form.</p></Reveal>
          <Reveal className="form-panel" delay={90}><ContactForm defaultService={service.title} /></Reveal>
        </div>
      </section>

      <section className="next-service"><div className="shell"><span>Continue exploring</span><Link href={`/services/${nextService.slug}`}>{nextService.title}<ArrowRight /></Link></div></section>
    </main>
  );
}
