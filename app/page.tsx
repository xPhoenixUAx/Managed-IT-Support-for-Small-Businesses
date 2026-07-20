import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  FileCheck2,
  KeyRound,
  MailCheck,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ContactForm } from "@/app/components/ContactForm";
import { Reveal } from "@/app/components/Reveal";
import { ServiceCard } from "@/app/components/ServiceCard";
import { services } from "@/app/content/services";

export const metadata: Metadata = {
  title: "Managed IT Support for Small Businesses",
  description: "Remote technical support, business email, device setup, backups, Wi-Fi help, and practical cybersecurity—explained in clear business language.",
};

const trustPoints = [
  { icon: MessagesSquare, title: "Plain-English help", text: "Clear answers without unnecessary jargon." },
  { icon: Clock3, title: "Remote-first support", text: "Solve common issues without waiting for a visit." },
  { icon: ShieldCheck, title: "Security-minded", text: "Practical protection built into everyday IT." },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero home-hero">
        <div className="hero-image-wrap">
          <Image unoptimized src="/images/hero-managed-it.webp" alt="IT support specialist helping a small-business owner" fill priority sizes="100vw" />
        </div>
        <div className="hero-social-rail" aria-hidden="true"><span>SMALL BUSINESS</span><i /><span>IT SUPPORT</span></div>
        <div className="hero-panel">
          <Reveal>
            <p className="eyebrow"><Sparkles size={16} /> Technology that feels manageable</p>
            <h1>Reliable IT help for your <em>small business.</em></h1>
            <p className="hero-lead">We support the email, devices, files, backups, and day-to-day technology your team depends on—without the cost of an internal system administrator.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/services/request-technical-support">Request support <ArrowRight size={18} /></Link>
              <Link className="button button-outline" href="/services">Explore services</Link>
            </div>
            <div className="hero-assurance"><BadgeCheck size={19} /><span>Remote support for practical business technology</span></div>
          </Reveal>
        </div>
        <div className="hero-badge"><strong>1</strong><span>trusted IT partner for the whole team</span></div>
      </section>

      <section className="trust-strip shell" aria-label="How SteadyDesk IT works">
        {trustPoints.map(({ icon: Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 70} className="trust-item">
            <Icon size={25} />
            <div><h2>{title}</h2><p>{text}</p></div>
          </Reveal>
        ))}
      </section>

      <section className="section services-preview">
        <div className="shell">
          <Reveal className="section-heading split-heading">
            <div><p className="eyebrow">What we take care of</p><h2>One practical partner for the systems behind your day.</h2></div>
            <div><p>From a single email problem to an organized support plan, we make business technology easier to understand, safer to use, and simpler to maintain.</p><Link href="/services" className="text-link">View every service <ArrowRight size={17} /></Link></div>
          </Reveal>
          <div className="service-grid swipe-row">
            {services.slice(0, 6).map((service, index) => <Reveal key={service.slug} delay={(index % 3) * 70}><ServiceCard service={service} index={index} /></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section story-section">
        <div className="shell story-grid">
          <Reveal className="story-images">
            <div className="story-image-large"><Image unoptimized src="/images/small-team-support.webp" alt="Small-business team working with dependable technology" fill sizes="(max-width: 800px) 100vw, 46vw" /></div>
            <div className="story-image-small"><Image unoptimized src="/images/backup-file-protection.webp" alt="Business owner reviewing protected company files" fill sizes="(max-width: 800px) 42vw, 18vw" /></div>
            <div className="story-fact"><strong>3–50</strong><span>employee teams are our sweet spot</span></div>
          </Reveal>
          <Reveal className="story-copy" delay={100}>
            <p className="eyebrow">Built around a small team</p>
            <h2>Good IT support should remove uncertainty—not add more of it.</h2>
            <p>Small businesses need someone who can see the whole picture: the employee who cannot sign in, the shared folder that grew messy, the laptop that needs replacing, and the backup nobody has tested.</p>
            <ul className="check-list">
              <li><Check /> One clear place to ask for help</li>
              <li><Check /> Recommendations matched to your size and budget</li>
              <li><Check /> Documented settings, access, and next steps</li>
              <li><Check /> Support for both immediate issues and planned improvements</li>
            </ul>
            <Link className="button button-primary" href="/about">How we work <ArrowRight size={18} /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <Reveal className="section-heading centered-heading">
            <p className="eyebrow">A clear support process</p>
            <h2>From “something is wrong” to a practical next step.</h2>
          </Reveal>
          <div className="process-grid">
            {[
              { n: "01", icon: MailCheck, title: "Tell us what you need", text: "Send the request, business impact, and any useful context. You do not need to diagnose it first." },
              { n: "02", icon: KeyRound, title: "We review and connect", text: "We identify the right path, ask focused questions, and connect securely when remote access is needed." },
              { n: "03", icon: FileCheck2, title: "Resolve and document", text: "We test the outcome, explain it clearly, and record useful details for future support." },
            ].map(({ n, icon: Icon, title, text }, index) => (
              <Reveal className="process-card" key={n} delay={index * 90}>
                <span className="process-number">{n}</span><div className="process-icon"><Icon /></div><h3>{title}</h3><p>{text}</p>{index < 2 && <ChevronRight className="process-arrow" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section security-section">
        <div className="shell security-grid">
          <Reveal className="security-copy">
            <p className="eyebrow">Practical cybersecurity</p>
            <h2>Start with the protections that make the biggest everyday difference.</h2>
            <p>We focus on understandable safeguards: safer sign-ins, current devices, protected email, reliable backups, and a simple plan for suspicious activity.</p>
            <div className="mini-outcomes">
              <div><ShieldCheck /><strong>Safer accounts</strong><span>Multi-factor authentication and access review</span></div>
              <div><FileCheck2 /><strong>Recoverable files</strong><span>Monitored backups and tested restore steps</span></div>
            </div>
            <Link className="button button-light" href="/services/cybersecurity-basics">Strengthen the basics <ArrowRight size={18} /></Link>
          </Reveal>
          <Reveal className="security-image" delay={100}>
            <Image unoptimized src="/images/cybersecurity-team.webp" alt="IT specialist reviewing practical cybersecurity with a business owner" fill sizes="(max-width: 800px) 100vw, 48vw" />
            <div className="floating-note"><ShieldCheck /><span><strong>Clear priorities</strong>Protection your team can actually use.</span></div>
          </Reveal>
        </div>
      </section>

      <section className="section guide-section">
        <div className="shell">
          <Reveal className="section-heading split-heading">
            <div><p className="eyebrow">Useful IT guidance</p><h2>Answers for the questions small-business owners ask most.</h2></div>
            <p>Short, practical guidance is part of how we work. Start with these common decisions, then ask us how they apply to your business.</p>
          </Reveal>
          <div className="guide-grid swipe-row">
            {[
              { icon: MailCheck, tag: "EMAIL", title: "Microsoft 365 or Google Workspace—which fits your team?", href: "/services/business-email-setup" },
              { icon: ShieldCheck, tag: "SECURITY", title: "Five cybersecurity basics every small business should put in place", href: "/services/cybersecurity-basics" },
              { icon: FileCheck2, tag: "BACKUP", title: "Cloud sync and cloud backup are not the same thing", href: "/services/cloud-backup" },
            ].map(({ icon: Icon, tag, title, href }, index) => (
              <Reveal className="guide-card" key={title} delay={index * 80}>
                <Icon /><span>{tag}</span><h3>{title}</h3><Link href={href}>Read practical guidance <ArrowRight size={17} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-band">
        <div className="shell contact-band-grid">
          <Reveal className="contact-band-copy">
            <p className="eyebrow">Let’s make IT easier</p>
            <h2>Tell us what is getting in the way of work.</h2>
            <p>Whether you have a current technical issue or want a more reliable setup, send a few details. We will reply by email with a practical next step.</p>
            <div className="contact-promise"><BadgeCheck /><span><strong>No technical diagnosis required.</strong> Describe the business problem in your own words.</span></div>
          </Reveal>
          <Reveal className="form-panel" delay={100}><ContactForm compact /></Reveal>
        </div>
      </section>
    </main>
  );
}
