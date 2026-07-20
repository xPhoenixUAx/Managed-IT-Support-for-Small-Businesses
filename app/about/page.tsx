import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ClipboardList, HeartHandshake, Lightbulb, ShieldCheck } from "lucide-react";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";

export const metadata: Metadata = { title: "About", description: "Learn how SteadyDesk IT provides clear, practical, security-minded support for small businesses without internal IT staff." };

export default function AboutPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="About" title="Technology support built around people doing real work." description="We bring structure, clear communication, and practical protection to small-business IT—without turning every decision into a technical project." image="/images/about-practical-it.webp" imageAlt="IT advisor meeting with a small-business owner" />

      <section className="section about-story">
        <div className="shell story-grid reverse">
          <Reveal className="story-copy"><p className="eyebrow">Why SteadyDesk IT exists</p><h2>Small teams deserve dependable IT guidance before problems become emergencies.</h2><p>Many small businesses reach a point where technology is too important to manage informally, but a full-time system administrator is not the right fit. SteadyDesk IT fills that gap with hands-on support, consistent setup, and advice owners can understand.</p><p>We look beyond the immediate ticket. If a recurring login issue points to a messy account process, or a lost file reveals that backups have never been tested, we explain the wider opportunity and help set a sensible priority.</p><Link className="button button-primary" href="/contact">Talk with us <ArrowRight size={18} /></Link></Reveal>
          <Reveal className="about-photo-stack" delay={90}><div className="about-main-photo"><Image unoptimized src="/images/small-business-it-advice.webp" alt="Practical IT planning session for a small company" fill sizes="(max-width: 800px) 100vw, 45vw" /></div><div className="about-note"><strong>Clear by default</strong><span>Every recommendation includes the business reason behind it.</span></div></Reveal>
        </div>
      </section>

      <section className="section values-section">
        <div className="shell">
          <Reveal className="section-heading centered-heading"><p className="eyebrow">How we show up</p><h2>Four principles behind every support decision.</h2></Reveal>
          <div className="value-grid swipe-row">
            {[
              { icon: HeartHandshake, title: "Human first", text: "We listen to the business impact before reaching for a technical answer." },
              { icon: Lightbulb, title: "Clear thinking", text: "We explain options, tradeoffs, and next steps in language the team can use." },
              { icon: ShieldCheck, title: "Security built in", text: "Safer settings and access are part of good everyday support—not an afterthought." },
              { icon: ClipboardList, title: "Documented work", text: "Useful notes, ownership, and processes make support more consistent over time." },
            ].map(({ icon: Icon, title, text }, index) => <Reveal className="value-card" key={title} delay={index * 70}><Icon /><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section partnership-section">
        <div className="shell partnership-grid">
          <Reveal className="partnership-image"><Image unoptimized src="/images/it-partnership.webp" alt="Small-business team collaborating confidently after IT improvements" fill sizes="(max-width: 800px) 100vw, 48vw" /></Reveal>
          <Reveal className="partnership-copy" delay={100}><p className="eyebrow">What partnership looks like</p><h2>Support for today, with an eye on what the business needs next.</h2><ul className="check-list"><li><Check /> Employees know where to ask for help</li><li><Check /> Owners see priorities instead of a wall of technical detail</li><li><Check /> New devices and accounts follow a consistent process</li><li><Check /> Backups and security are checked, not assumed</li><li><Check /> Technology decisions reflect the way the team works</li></ul><Link className="button button-light" href="/services/it-support-plans">Explore support plans <ArrowRight size={18} /></Link></Reveal>
        </div>
      </section>
    </main>
  );
}
