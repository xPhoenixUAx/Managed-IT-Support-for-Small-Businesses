import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function PageHero({ eyebrow, title, description, image, imageAlt }: { eyebrow: string; title: string; description: string; image: string; imageAlt: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-image"><Image unoptimized src={image} alt={imageAlt} fill priority sizes="100vw" /></div>
      <div className="page-hero-panel">
        <Reveal>
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} /><span>{eyebrow}</span></nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </Reveal>
      </div>
      <div className="page-hero-accent"><strong>IT</strong><span>made practical</span></div>
    </section>
  );
}
