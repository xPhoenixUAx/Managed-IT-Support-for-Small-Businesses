import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/app/components/ContactForm";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { siteConfig } from "@/app/config/site-config";

export const metadata: Metadata = { title: "Contact", description: "Request technical support, ask about a service, or contact SteadyDesk IT about information, advertising, and partnerships." };

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Contact" title="Tell us what your business needs from IT." description="Request support, ask about a setup project, discuss ongoing service, or contact us about information and collaboration." image="/images/contact-support.webp" imageAlt="Support coordinator responding to a small-business IT request" />
      <section className="section contact-page-section">
        <div className="shell contact-page-grid">
          <Reveal className="contact-form-column"><p className="eyebrow">Send a request</p><h2>Start with a few useful details.</h2><p>Explain what is happening and how it affects the business. You do not need to know the technical cause.</p><ContactForm /></Reveal>
          <Reveal className="contact-info-column" delay={90}>
            <div className="contact-info-card"><Mail /><span>Email</span><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a><p>Technical support, service questions, advertising, partnerships, and general information.</p></div>
            <div className="contact-info-card"><MapPin /><span>Company address</span><p>{siteConfig.contact.address}</p><small>Company ID {siteConfig.contact.companyId}</small></div>
            <div className="contact-info-card"><ArrowUpRight /><span>Website</span><a href={siteConfig.contact.website}>{siteConfig.contact.websiteLabel}</a></div>
            <div className="contact-safety"><ShieldCheck /><div><strong>Keep credentials private</strong><p>Do not include passwords, one-time codes, recovery keys, or other sensitive credentials in a form or email.</p></div></div>
          </Reveal>
        </div>
      </section>
      <section className="contact-next"><div className="shell"><p>Need help describing the issue?</p><Link href="/services/request-technical-support">See what to include in a support request <ArrowUpRight /></Link></div></section>
    </main>
  );
}
