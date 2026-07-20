import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/app/config/site-config";
import { services } from "@/app/content/services";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-main shell">
        <div className="footer-brand">
          <Link href="/" className="brand brand-footer">
            <span className="brand-mark">{siteConfig.brand.shortMark}</span>
            <span className="brand-copy"><strong>{siteConfig.brand.siteName}</strong><small>{siteConfig.brand.tagline}</small></span>
          </Link>
          <p>{siteConfig.footer.text}</p>
          <p className="service-area">{siteConfig.footer.serviceArea}</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          {siteConfig.navigation.primary.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          {siteConfig.navigation.legal.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </div>
        <div className="footer-column footer-services">
          <h2>Services</h2>
          {services.slice(0, 6).map((service) => <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>)}
        </div>
        <div className="footer-column footer-contact">
          <h2>Contact</h2>
          <a href={`mailto:${siteConfig.contact.email}`}><Mail size={18} /> {siteConfig.contact.email}</a>
          <p><MapPin size={18} /> <span>{siteConfig.contact.address}</span></p>
          <a href={siteConfig.contact.website} target="_blank" rel="noreferrer">{siteConfig.contact.websiteLabel} <ArrowUpRight size={16} /></a>
          <Link href="/contact" className="button button-light">Send a request</Link>
        </div>
      </div>
      <div className="footer-bottom shell">
        <p>{siteConfig.brand.companyName} · {siteConfig.contact.address} · Company ID {siteConfig.contact.companyId}</p>
        <p>© {year} {siteConfig.brand.siteName}. {siteConfig.footer.copyright}</p>
      </div>
    </footer>
  );
}
