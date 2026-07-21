import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../config/site-config.mjs";
import { services } from "../config/services.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const glyph = (symbol, className = "") => `<span class="icon-glyph ${className}" aria-hidden="true">${symbol}</span>`;
const arrow = `<span aria-hidden="true">→</span>`;
const check = `${glyph("✓", "check-glyph")}`;

const serviceLinks = () => services.map((service) =>
  `<a href="/services/${service.slug}">${escapeHtml(service.title)}</a>`).join("");

function header(currentPath) {
  const active = (href) => href === "/" ? currentPath === "/" : currentPath.startsWith(href);
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="header-inner">
        <a href="/" class="brand" aria-label="${escapeHtml(siteConfig.brand.siteName)} home">
          <span class="brand-mark">${escapeHtml(siteConfig.brand.shortMark)}</span>
          <span class="brand-copy"><strong>${escapeHtml(siteConfig.brand.siteName)}</strong><small>${escapeHtml(siteConfig.brand.tagline)}</small></span>
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          <a href="/"${active("/") ? ' class="active"' : ""}>Home</a>
          <a href="/about"${active("/about") ? ' class="active"' : ""}>About</a>
          <div class="nav-dropdown">
            <a href="/services"${active("/services") ? ' class="active"' : ""}>Services <span aria-hidden="true">⌄</span></a>
            <div class="dropdown-panel" aria-label="Services submenu">${serviceLinks()}</div>
          </div>
          <a href="/contact"${active("/contact") ? ' class="active"' : ""}>Contact</a>
        </nav>
        <div class="header-contact">${glyph("✉")}<span><small>Email support</small><a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a></span></div>
        <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span aria-hidden="true">☰</span></button>
      </div>
      <div id="mobile-menu" class="mobile-menu" data-mobile-menu aria-hidden="true">
        <nav aria-label="Mobile navigation">
          <a href="/">Home</a><a href="/about">About</a>
          <button type="button" class="mobile-services-toggle" data-services-toggle aria-expanded="false">Services <span aria-hidden="true">⌄</span></button>
          <div class="mobile-services" data-mobile-services><a href="/services">All services</a>${serviceLinks()}</div>
          <a href="/contact">Contact</a>
        </nav>
        <div class="mobile-contact"><span>Email support</span><a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a><a href="/services/request-technical-support" class="button button-primary">Request support</a></div>
      </div>
    </header>`;
}

function footer() {
  const primary = siteConfig.navigation.primary.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join("");
  const legal = siteConfig.navigation.legal.map((link) => `<a href="${link.href}">${escapeHtml(link.label)}</a>`).join("");
  return `
    <footer class="site-footer">
      <div class="footer-main shell">
        <div class="footer-brand">
          <a href="/" class="brand brand-footer"><span class="brand-mark">${escapeHtml(siteConfig.brand.shortMark)}</span><span class="brand-copy"><strong>${escapeHtml(siteConfig.brand.siteName)}</strong><small>${escapeHtml(siteConfig.brand.tagline)}</small></span></a>
          <p>${escapeHtml(siteConfig.footer.text)}</p><p class="service-area">${escapeHtml(siteConfig.footer.serviceArea)}</p>
        </div>
        <div class="footer-column"><h2>Explore</h2>${primary}${legal}</div>
        <div class="footer-column footer-services"><h2>Services</h2>${services.slice(0, 6).map((service) => `<a href="/services/${service.slug}">${escapeHtml(service.title)}</a>`).join("")}</div>
        <div class="footer-column footer-contact"><h2>Contact</h2><a href="mailto:${escapeHtml(siteConfig.contact.email)}">${glyph("✉")} ${escapeHtml(siteConfig.contact.email)}</a><p>${glyph("⌖")}<span>${escapeHtml(siteConfig.contact.address)}</span></p><a href="${escapeHtml(siteConfig.contact.website)}">${escapeHtml(siteConfig.contact.websiteLabel)} ${arrow}</a><a href="/contact" class="button button-light">Send a request</a></div>
      </div>
      <div class="footer-bottom shell"><p>${escapeHtml(siteConfig.brand.companyName)} · ${escapeHtml(siteConfig.contact.address)} · Company ID ${escapeHtml(siteConfig.contact.companyId)}</p><p>© ${new Date().getFullYear()} ${escapeHtml(siteConfig.brand.siteName)}. ${escapeHtml(siteConfig.footer.copyright)}</p></div>
    </footer>`;
}

function layout({ title, description, pathName, main }) {
  const fullTitle = title === "Managed IT Support for Small Businesses"
    ? `${siteConfig.brand.siteName} | ${title}`
    : `${title} | ${siteConfig.brand.siteName}`;
  const canonical = `${siteConfig.contact.website}${pathName === "/" ? "" : pathName}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(siteConfig.contact.website)}/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="/assets/styles.css">
  <script src="/assets/config.js" defer></script>
  <script src="/assets/app.js" defer></script>
</head>
<body>
${header(pathName)}
${main}
${footer()}
</body>
</html>`;
}

function serviceCard(service, index) {
  return `<article class="service-card reveal">
    <a class="service-image" href="/services/${service.slug}" aria-label="Learn about ${escapeHtml(service.title)}"><img src="${service.image}" alt="${escapeHtml(service.title)} for a small business team" loading="lazy"><span class="card-number">${String(index + 1).padStart(2, "0")}</span></a>
    <div class="service-card-body"><span class="service-icon">${glyph("•")}</span><p class="eyebrow">${escapeHtml(service.eyebrow)}</p><h3><a href="/services/${service.slug}">${escapeHtml(service.title)}</a></h3><p>${escapeHtml(service.summary)}</p><a class="text-link" href="/services/${service.slug}">Explore service ${arrow}</a></div>
  </article>`;
}

function contactForm(defaultService = "", compact = false) {
  const options = [...siteConfig.forms.inquiryTypes];
  if (defaultService && !options.includes(defaultService)) options.unshift(defaultService);
  return `<div data-form-shell>
    <form class="contact-form${compact ? " compact" : ""}" data-contact-form>
      <input class="form-trap" type="text" name="companyWebsite" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form-grid">
        <label><span>Name</span><input required name="name" type="text" autocomplete="name" placeholder="Your name"></label>
        <label><span>Business email</span><input required name="email" type="email" autocomplete="email" placeholder="you@company.com"></label>
        <label><span>Company</span><input required name="company" type="text" autocomplete="organization" placeholder="Company name"></label>
        <label><span>What can we help with?</span><select required name="inquiryType"><option value="" disabled${defaultService ? "" : " selected"}>Select a request type</option>${options.map((type) => `<option value="${escapeHtml(type)}"${type === defaultService ? " selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select></label>
      </div>
      <label><span>How is this affecting the business?</span><textarea required minlength="10" name="message" rows="${compact ? 4 : 6}" placeholder="Describe the issue, setup, or information you need. Please do not include passwords or verification codes."></textarea></label>
      <label class="consent"><input required name="consent" type="checkbox" value="agreed"><span>${escapeHtml(siteConfig.forms.consentLabel)}</span></label>
      <div class="form-error" data-form-status role="alert" hidden></div>
      <button class="button button-primary submit-button" type="submit">Send request</button>
      <p class="form-note">Messages are sent securely to ${escapeHtml(siteConfig.contact.email)}.</p>
    </form>
    <div class="modal-backdrop" data-success-modal hidden>
      <div class="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" tabindex="-1">
        <button class="modal-close" type="button" data-modal-close aria-label="Close confirmation">×</button>
        <div class="modal-check">✓</div><p class="eyebrow">Message sent</p><h2 id="success-title">${escapeHtml(siteConfig.forms.successTitle)}</h2>
        <p>Thanks for contacting ${escapeHtml(siteConfig.brand.siteName)}. ${escapeHtml(siteConfig.forms.successMessage)}</p><p class="modal-email">A copy was delivered to <strong>${escapeHtml(siteConfig.contact.email)}</strong>.</p>
        <button class="button button-primary" type="button" data-modal-close>Done</button>
      </div>
    </div>
  </div>`;
}

function pageHero(eyebrow, title, description, image, alt) {
  return `<section class="page-hero"><div class="page-hero-image"><img src="${image}" alt="${escapeHtml(alt)}"></div><div class="page-hero-panel reveal"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div><div class="page-hero-accent">${escapeHtml(eyebrow)}</div></section>`;
}

const homeMain = `<main id="main-content">
  <section class="hero home-hero">
    <div class="hero-image-wrap"><img src="/images/hero-managed-it.webp" alt="IT support specialist helping a small-business owner"></div>
    <div class="hero-social-rail" aria-hidden="true"><span>SMALL BUSINESS</span><i></i><span>IT SUPPORT</span></div>
    <div class="hero-panel"><div class="reveal"><p class="eyebrow">✦ Technology that feels manageable</p><h1>Reliable IT help for your <em>small business.</em></h1><p class="hero-lead">We support the email, devices, files, backups, and day-to-day technology your team depends on—without the cost of an internal system administrator.</p><div class="hero-actions"><a class="button button-primary" href="/services/request-technical-support">Request support ${arrow}</a><a class="button button-outline" href="/services">Explore services</a></div><div class="hero-assurance">${check}<span>Remote support for practical business technology</span></div></div></div>
    <div class="hero-badge"><strong>1</strong><span>trusted IT partner for the whole team</span></div>
  </section>
  <section class="trust-strip shell" aria-label="How ${escapeHtml(siteConfig.brand.siteName)} works">
    ${[["◇","Plain-English help","Clear answers without unnecessary jargon."],["◷","Remote-first support","Solve common issues without waiting for a visit."],["⬡","Security-minded","Practical protection built into everyday IT."]].map(([icon,title,text]) => `<div class="trust-item reveal">${glyph(icon)}<div><h2>${title}</h2><p>${text}</p></div></div>`).join("")}
  </section>
  <section class="section services-preview"><div class="shell"><div class="section-heading split-heading reveal"><div><p class="eyebrow">What we take care of</p><h2>One practical partner for the systems behind your day.</h2></div><div><p>From a single email problem to an organized support plan, we make business technology easier to understand, safer to use, and simpler to maintain.</p><a href="/services" class="text-link">View every service ${arrow}</a></div></div><div class="service-grid swipe-row">${services.slice(0,6).map(serviceCard).join("")}</div></div></section>
  <section class="section story-section"><div class="shell story-grid"><div class="story-images reveal"><div class="story-image-large"><img src="/images/small-team-support.webp" alt="Small-business team working with dependable technology" loading="lazy"></div><div class="story-image-small"><img src="/images/backup-file-protection.webp" alt="Business owner reviewing protected company files" loading="lazy"></div><div class="story-fact"><strong>3–50</strong><span>employee teams are our sweet spot</span></div></div><div class="story-copy reveal"><p class="eyebrow">Built around a small team</p><h2>Good IT support should remove uncertainty—not add more of it.</h2><p>Small businesses need someone who can see the whole picture: the employee who cannot sign in, the shared folder that grew messy, the laptop that needs replacing, and the backup nobody has tested.</p><ul class="check-list"><li>${check}One clear place to ask for help</li><li>${check}Recommendations matched to your size and budget</li><li>${check}Documented settings, access, and next steps</li><li>${check}Support for immediate issues and planned improvements</li></ul><a class="button button-primary" href="/about">How we work ${arrow}</a></div></div></section>
  <section class="section process-section"><div class="shell"><div class="section-heading centered-heading reveal"><p class="eyebrow">A clear support process</p><h2>From “something is wrong” to a practical next step.</h2></div><div class="process-grid">${[["01","Tell us what you need","Send the request, business impact, and any useful context. You do not need to diagnose it first."],["02","We review and connect","We identify the right path, ask focused questions, and connect securely when remote access is needed."],["03","Resolve and document","We test the outcome, explain it clearly, and record useful details for future support."]].map(([n,title,text]) => `<div class="process-card reveal"><span class="process-number">${n}</span><div class="process-icon">${glyph("✓")}</div><h3>${title}</h3><p>${text}</p></div>`).join("")}</div></div></section>
  <section class="section security-section"><div class="shell security-grid"><div class="security-copy reveal"><p class="eyebrow">Practical cybersecurity</p><h2>Start with the protections that make the biggest everyday difference.</h2><p>We focus on understandable safeguards: safer sign-ins, current devices, protected email, reliable backups, and a simple plan for suspicious activity.</p><div class="mini-outcomes"><div>${glyph("⬡")}<strong>Safer accounts</strong><span>Multi-factor authentication and access review</span></div><div>${glyph("✓")}<strong>Recoverable files</strong><span>Monitored backups and tested restore steps</span></div></div><a class="button button-light" href="/services/cybersecurity-basics">Strengthen the basics ${arrow}</a></div><div class="security-image reveal"><img src="/images/cybersecurity-team.webp" alt="IT specialist reviewing practical cybersecurity with a business owner" loading="lazy"><div class="floating-note">${glyph("⬡")}<span><strong>Clear priorities</strong>Protection your team can actually use.</span></div></div></div></section>
  <section class="section guide-section"><div class="shell"><div class="section-heading split-heading reveal"><div><p class="eyebrow">Useful IT guidance</p><h2>Answers for the questions small-business owners ask most.</h2></div><p>Short, practical guidance is part of how we work. Start with these common decisions, then ask us how they apply to your business.</p></div><div class="guide-grid swipe-row">${[["EMAIL","Microsoft 365 or Google Workspace—which fits your team?","business-email-setup"],["SECURITY","Five cybersecurity basics every small business should put in place","cybersecurity-basics"],["BACKUP","Cloud sync and cloud backup are not the same thing","cloud-backup"]].map(([tag,title,slug]) => `<article class="guide-card reveal">${glyph("✦")}<span>${tag}</span><h3>${title}</h3><a href="/services/${slug}">Read practical guidance ${arrow}</a></article>`).join("")}</div></div></section>
  <section class="section contact-band"><div class="shell contact-band-grid"><div class="contact-band-copy reveal"><p class="eyebrow">Let’s make IT easier</p><h2>Tell us what is getting in the way of work.</h2><p>Whether you have a current technical issue or want a more reliable setup, send a few details. We will reply by email with a practical next step.</p><div class="contact-promise">${check}<span><strong>No technical diagnosis required.</strong> Describe the business problem in your own words.</span></div></div><div class="form-panel reveal">${contactForm("", true)}</div></div></section>
</main>`;

const servicesMain = `<main id="main-content">${pageHero("Services","Complete IT support for the way a small business works.","Choose help for one immediate need or connect the services into a reliable day-to-day support plan.","/images/services-overview.webp","IT specialist working with a small-business team")}
  <section class="section service-directory"><div class="shell"><div class="section-heading split-heading reveal"><div><p class="eyebrow">Explore every service</p><h2>Practical support from first setup to ongoing care.</h2></div><p>Each service is explained in business terms, with clear inclusions, outcomes, and next steps. Start where the need is most obvious.</p></div><div class="service-grid swipe-row">${services.map(serviceCard).join("")}</div></div></section>
  <section class="section plan-callout"><div class="shell plan-callout-grid"><div class="reveal"><p class="eyebrow">Not sure where to begin?</p><h2>Start with the business problem, not a technical label.</h2><p>Tell us what is unreliable, difficult, or taking too much time. We will help identify the most sensible service and avoid unnecessary work.</p><ul class="check-list"><li>${check}No obligation to choose a plan first</li><li>${check}Clear scope before project work begins</li><li>${check}Recommendations matched to your team size</li></ul></div><div class="form-panel reveal">${contactForm("", true)}</div></div></section>
</main>`;

const aboutMain = `<main id="main-content">${pageHero("About","Technology support built around people doing real work.","We bring structure, clear communication, and practical protection to small-business IT—without turning every decision into a technical project.","/images/about-practical-it.webp","IT advisor meeting with a small-business owner")}
  <section class="section about-story"><div class="shell story-grid reverse"><div class="story-copy reveal"><p class="eyebrow">Why ${escapeHtml(siteConfig.brand.siteName)} exists</p><h2>Small teams deserve dependable IT guidance before problems become emergencies.</h2><p>Many small businesses reach a point where technology is too important to manage informally, but a full-time system administrator is not the right fit. ${escapeHtml(siteConfig.brand.siteName)} fills that gap with hands-on support, consistent setup, and advice owners can understand.</p><p>We look beyond the immediate ticket and explain wider opportunities in practical business language.</p><a class="button button-primary" href="/contact">Talk with us ${arrow}</a></div><div class="about-photo-stack reveal"><div class="about-main-photo"><img src="/images/small-business-it-advice.webp" alt="Practical IT planning session for a small company"></div><div class="about-note"><strong>Clear by default</strong><span>Every recommendation includes the business reason behind it.</span></div></div></div></section>
  <section class="section values-section"><div class="shell"><div class="section-heading centered-heading reveal"><p class="eyebrow">How we show up</p><h2>Four principles behind every support decision.</h2></div><div class="value-grid swipe-row">${[["Human first","We listen to the business impact before reaching for a technical answer."],["Clear thinking","We explain options, tradeoffs, and next steps in language the team can use."],["Security built in","Safer settings and access are part of good everyday support—not an afterthought."],["Documented work","Useful notes, ownership, and processes make support more consistent over time."]].map(([title,text],i)=>`<article class="value-card reveal">${glyph("✦")}<span>${String(i+1).padStart(2,"0")}</span><h3>${title}</h3><p>${text}</p></article>`).join("")}</div></div></section>
  <section class="section partnership-section"><div class="shell partnership-grid"><div class="partnership-image reveal"><img src="/images/it-partnership.webp" alt="Small-business team collaborating confidently after IT improvements"></div><div class="partnership-copy reveal"><p class="eyebrow">What partnership looks like</p><h2>Support for today, with an eye on what the business needs next.</h2><ul class="check-list"><li>${check}Employees know where to ask for help</li><li>${check}Owners see priorities instead of technical clutter</li><li>${check}New devices and accounts follow a consistent process</li><li>${check}Backups and security are checked, not assumed</li><li>${check}Technology decisions reflect the way the team works</li></ul><a class="button button-light" href="/services/it-support-plans">Explore support plans ${arrow}</a></div></div></section>
</main>`;

const contactMain = `<main id="main-content">${pageHero("Contact","Tell us what your business needs from IT.","Request support, ask about a setup project, discuss ongoing service, or contact us about information and collaboration.","/images/contact-support.webp","Support coordinator responding to a small-business IT request")}
  <section class="section contact-page-section"><div class="shell contact-page-grid"><div class="contact-form-column reveal"><p class="eyebrow">Send a request</p><h2>Start with a few useful details.</h2><p>Explain what is happening and how it affects the business. You do not need to know the technical cause.</p>${contactForm()}</div><div class="contact-info-column reveal"><div class="contact-info-card">${glyph("✉")}<span>Email</span><a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a><p>Technical support, service questions, advertising, partnerships, and general information.</p></div><div class="contact-info-card">${glyph("⌖")}<span>Company address</span><p>${escapeHtml(siteConfig.contact.address)}</p><small>Company ID ${escapeHtml(siteConfig.contact.companyId)}</small></div><div class="contact-info-card">${glyph("↗")}<span>Website</span><a href="${escapeHtml(siteConfig.contact.website)}">${escapeHtml(siteConfig.contact.websiteLabel)}</a></div><div class="contact-safety">${glyph("⬡")}<div><strong>Keep credentials private</strong><p>Do not include passwords, one-time codes, recovery keys, or other sensitive credentials in a form or email.</p></div></div></div></div></section>
  <section class="contact-next"><div class="shell"><p>Need help describing the issue?</p><a href="/services/request-technical-support">See what to include in a support request ${arrow}</a></div></section>
</main>`;

function serviceMain(service, index) {
  const next = services[(index + 1) % services.length];
  return `<main id="main-content">
    <section class="service-hero"><div class="service-hero-image"><img src="${service.image}" alt="${escapeHtml(service.title)} for small-business teams"></div><div class="service-hero-panel"><div class="reveal"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/services">Services</a><span>›</span><span>${escapeHtml(service.title)}</span></nav><div class="service-hero-icon">${glyph("✦")}</div><p class="eyebrow">${escapeHtml(service.eyebrow)}</p><h1>${escapeHtml(service.title)}</h1><p>${escapeHtml(service.summary)}</p><a class="button button-primary" href="#request">Ask about this service ${arrow}</a></div></div><div class="service-index">${String(index+1).padStart(2,"0")}<span>/ ${String(services.length).padStart(2,"0")}</span></div></section>
    <section class="section service-intro"><div class="shell service-intro-grid"><div class="reveal"><p class="eyebrow">What this service solves</p><h2>A practical setup your team can use with confidence.</h2></div><div class="reveal"><p class="large-copy">${escapeHtml(service.description)}</p><div class="service-contact-line">${glyph("✉")}<span>Questions before you begin?</span><a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a></div></div></div></section>
    <section class="section service-included"><div class="shell detail-grid"><div class="detail-panel dark-panel reveal"><p class="eyebrow">What is included</p><h2>Focused support, clearly scoped.</h2><ul class="feature-list">${service.included.map((item)=>`<li>${check}${escapeHtml(item)}</li>`).join("")}</ul></div><div class="detail-panel outcome-panel reveal"><p class="eyebrow">Business outcomes</p><h2>What improves for your team.</h2><div class="outcome-list">${service.outcomes.map((item,i)=>`<div><span>${String(i+1).padStart(2,"0")}</span><p>${escapeHtml(item)}</p></div>`).join("")}</div></div></div></section>
    <section class="section service-process"><div class="shell"><div class="section-heading centered-heading reveal"><p class="eyebrow">How the work moves forward</p><h2>Three clear stages, with no mystery in the middle.</h2></div><div class="process-grid">${service.process.map((step,i)=>`<div class="process-card reveal"><span class="process-number">${String(i+1).padStart(2,"0")}</span><div class="process-icon">${glyph("✓")}</div><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></div>`).join("")}</div></div></section>
    <section class="section service-fit"><div class="shell service-fit-grid"><div class="fit-copy reveal"><p class="eyebrow">A good fit for</p><h2>Support designed around real small-business conditions.</h2><ul class="check-list">${service.idealFor.map((item)=>`<li>${check}${escapeHtml(item)}</li>`).join("")}</ul><a class="button button-primary" href="#request">Discuss your situation ${arrow}</a></div><div class="fit-faq reveal"><p class="eyebrow">Common questions</p>${service.faq.map((item)=>`<details><summary>${escapeHtml(item.question)}<span>+</span></summary><p>${escapeHtml(item.answer)}</p></details>`).join("")}</div></div></section>
    <section class="section request-section" id="request"><div class="shell request-grid"><div class="reveal"><p class="eyebrow">Request ${escapeHtml(service.title)}</p><h2>Tell us what you need to improve.</h2><p>Describe the team, current setup, issue, or result you want. We will reply by email with focused questions and a practical next step.</p><p class="safety-note"><strong>Please do not send passwords or verification codes.</strong> We will never ask for them through this form.</p></div><div class="form-panel reveal">${contactForm(service.title)}</div></div></section>
    <section class="next-service"><div class="shell"><span>Continue exploring</span><a href="/services/${next.slug}">${escapeHtml(next.title)} ${arrow}</a></div></section>
  </main>`;
}

const legalPages = {
  "/privacy-policy": {
    title: "Privacy Policy",
    intro: "This policy explains what information we collect through this website, why we use it, and the choices available to you.",
    sections: [
      ["1. Information we collect", "When you submit a form, we collect the information you provide, including your name, business email, company name, inquiry type, and message. We may also receive limited technical information needed to operate and protect the website."],
      ["2. How we use information", "We use submitted information to respond to support requests, prepare service information, discuss advertising or partnerships, and provide the additional information you requested."],
      ["3. Legal basis and consent", "We process form information to take steps at your request and on the basis of the consent you provide with the form. You may withdraw consent for future communication at any time."],
      ["4. Sharing and service providers", "We do not sell personal information. Information may be processed by providers that help us host the website, deliver email, secure systems, or provide requested support."],
      ["5. Retention and security", "We retain inquiries only as long as needed for communication, service records, legal requirements, and reasonable business administration."],
      ["6. Your choices", `You may ask to access, correct, or delete information associated with your inquiry by contacting <a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a>.`],
      ["7. Sensitive information", "Do not send passwords, one-time verification codes, recovery keys, financial account details, or other sensitive credentials through the website form or ordinary email."],
      ["8. Changes", "We may update this policy as our services or legal obligations change. The date above identifies the current version."],
    ],
  },
  "/terms": {
    title: "Terms & Conditions",
    intro: `These terms govern use of the ${siteConfig.brand.siteName} website. Specific services are provided under a separate written scope or service agreement.`,
    sections: [
      ["1. Website purpose", `This website provides general information about ${escapeHtml(siteConfig.brand.companyName)} and allows visitors to request support, service information, advertising or partnership contact, and other information.`],
      ["2. No automatic service relationship", "Submitting a form does not create a client relationship, guarantee availability, or authorize us to access a device or account."],
      ["3. Acceptable use", "You agree not to misuse the website, interfere with its operation, submit unlawful or harmful content, impersonate another person, or attempt unauthorized access."],
      ["4. Information and recommendations", "Website content is general educational information, not a complete assessment of your environment."],
      ["5. Intellectual property", `The site design, original text, graphics, and branding are owned by or licensed to ${escapeHtml(siteConfig.brand.companyName)}.`],
      ["6. Third-party services", "The website may reference third-party products or websites. Those services operate under their own terms and privacy practices."],
      ["7. Availability and liability", "We aim to keep the website accurate and available but do not promise uninterrupted access."],
      ["8. Contact", `Questions about these terms may be sent to <a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a>.`],
    ],
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    intro: `This page explains the limited browser storage that may be used when you visit the ${siteConfig.brand.siteName} website.`,
    sections: [
      ["1. What cookies are", "Cookies are small data files that a website may place in a browser. Similar technologies can remember preferences, maintain security, or measure how a site is used."],
      ["2. Cookies used by this site", "We design this website to work without advertising cookies. Essential hosting or security technology may use short-lived identifiers needed to deliver pages or prevent abuse."],
      ["3. Analytics and advertising", "We do not currently use behavior-based advertising cookies on this website."],
      ["4. Managing browser storage", "You can remove or block cookies using your browser settings. Blocking essential storage may affect security checks or form operation."],
      ["5. Changes and questions", `Questions may be sent to <a href="mailto:${escapeHtml(siteConfig.contact.email)}">${escapeHtml(siteConfig.contact.email)}</a>.`],
    ],
  },
};

function legalMain(page) {
  return `<main id="main-content"><section class="legal-hero"><div class="shell"><p class="eyebrow">Legal</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.intro)}</p><span>Last updated: July 21, 2026</span></div></section><section class="section legal-section"><article class="legal-content shell">${page.sections.map(([title,text])=>`<h2>${escapeHtml(title)}</h2><p>${text}</p>`).join("")}</article></section></main>`;
}

async function writePage(route, page) {
  const relative = route === "/" ? "index.html" : path.join(route.slice(1), "index.html");
  const output = path.join(client, relative);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, page, "utf8");
}

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

await cp(path.join(root, "site", "assets"), path.join(client, "assets"), { recursive: true });
await cp(path.join(root, "public", "images"), path.join(client, "images"), { recursive: true });
await cp(path.join(root, "public", "og.png"), path.join(client, "og.png"));
await writeFile(path.join(client, "assets", "config.js"), `window.SITE_CONFIG = ${JSON.stringify(siteConfig, null, 2)};\n`, "utf8");
await writeFile(path.join(client, "_headers"), "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n", "utf8");

await writePage("/", layout({ title: "Managed IT Support for Small Businesses", description: "Remote technical support, business email, device setup, backups, Wi-Fi help, and practical cybersecurity for small businesses.", pathName: "/", main: homeMain }));
await writePage("/services", layout({ title: "IT Services", description: "Explore remote support, device management, email, backup, Wi-Fi, and cybersecurity services for small businesses.", pathName: "/services", main: servicesMain }));
await writePage("/about", layout({ title: "About", description: `Learn how ${siteConfig.brand.siteName} provides clear, practical, security-minded support for small businesses.`, pathName: "/about", main: aboutMain }));
await writePage("/contact", layout({ title: "Contact", description: `Request technical support, ask about a service, or contact ${siteConfig.brand.siteName} about information, advertising, and partnerships.`, pathName: "/contact", main: contactMain }));

for (const [index, service] of services.entries()) {
  const route = `/services/${service.slug}`;
  await writePage(route, layout({ title: service.title, description: service.summary, pathName: route, main: serviceMain(service, index) }));
}

for (const [route, page] of Object.entries(legalPages)) {
  await writePage(route, layout({ title: page.title, description: page.intro, pathName: route, main: legalMain(page) }));
}

await cp(path.join(root, "server", "index.js"), path.join(server, "index.js"));
await cp(path.join(root, "server", "wrangler.json"), path.join(server, "wrangler.json"));
await cp(path.join(root, "config", "site-config.mjs"), path.join(server, "site-config.js"));
await mkdir(path.join(dist, ".openai"), { recursive: true });
await cp(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));

const routes = 4 + services.length + Object.keys(legalPages).length;
process.stdout.write(`Built ${routes} framework-free HTML pages.\n`);
