import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/app/config/site-config";

export function LegalPage({ title, intro, children, updated = "July 21, 2026" }: { title: string; intro: string; children: ReactNode; updated?: string }) {
  return (
    <main id="main-content" className="legal-page">
      <header className="legal-hero shell"><nav className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={14} /><span>{title}</span></nav><p className="eyebrow">Legal information</p><h1>{title}</h1><p>{intro}</p><small>Last updated: {updated}</small></header>
      <div className="shell legal-layout"><aside><strong>Company details</strong><p>{siteConfig.brand.companyName}</p><p>{siteConfig.contact.address}</p><p>Company ID {siteConfig.contact.companyId}</p><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></aside><article className="legal-content">{children}</article></div>
    </main>
  );
}
