"use client";

import Link from "next/link";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/app/config/site-config";
import { services } from "@/app/content/services";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-lock", menuOpen);
    return () => document.body.classList.remove("menu-lock");
  }, [menuOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const closeMenus = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.brand.siteName} home`}>
          <span className="brand-mark">{siteConfig.brand.shortMark}</span>
          <span className="brand-copy">
            <strong>{siteConfig.brand.siteName}</strong>
            <small>{siteConfig.brand.tagline}</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/" className={isActive("/") ? "active" : ""}>Home</Link>
          <Link href="/about" className={isActive("/about") ? "active" : ""}>About</Link>
          <div className="nav-dropdown">
            <Link href="/services" className={isActive("/services") ? "active" : ""}>
              Services <ChevronDown size={15} strokeWidth={2.3} />
            </Link>
            <div className="dropdown-panel" aria-label="Services submenu">
              {services.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`}>{service.title}</Link>
              ))}
            </div>
          </div>
          <Link href="/contact" className={isActive("/contact") ? "active" : ""}>Contact</Link>
        </nav>

        <div className="header-contact">
          <Mail size={20} aria-hidden="true" />
          <span><small>Email support</small><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></span>
        </div>

        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          <Link href="/" onClick={closeMenus}>Home</Link>
          <Link href="/about" onClick={closeMenus}>About</Link>
          <button type="button" className="mobile-services-toggle" onClick={() => setServicesOpen((open) => !open)} aria-expanded={servicesOpen}>
            Services <ChevronDown className={servicesOpen ? "rotated" : ""} size={18} />
          </button>
          <div className={`mobile-services ${servicesOpen ? "open" : ""}`}>
            <Link href="/services" onClick={closeMenus}>All services</Link>
            {services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} onClick={closeMenus}>{service.title}</Link>)}
          </div>
          <Link href="/contact" onClick={closeMenus}>Contact</Link>
        </nav>
        <div className="mobile-contact">
          <span>Email support</span>
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          <Link href="/services/request-technical-support" className="button button-primary" onClick={closeMenus}>Request support</Link>
        </div>
      </div>
    </header>
  );
}
