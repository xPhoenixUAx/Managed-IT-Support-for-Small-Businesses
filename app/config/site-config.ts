export const siteConfig = {
  brand: {
    siteName: "SteadyDesk IT",
    companyName: "SteadyDesk IT Services LLC",
    shortMark: "SD",
    tagline: "Practical IT support for small business",
  },
  contact: {
    email: "support@steadydeskit.com",
    website: "https://steadydeskit.com",
    websiteLabel: "steadydeskit.com",
    address: "201 W 5th Street, Suite 1100, Austin, TX 78701",
    companyId: "TX-IT-29841",
  },
  navigation: {
    primary: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
  forms: {
    endpoint: "/api/contact",
    inquiryTypes: [
      "Request technical support",
      "Ask about an IT support plan",
      "Schedule a setup project",
      "Advertising or partnership",
      "General information",
    ],
    successTitle: "Your request is on its way",
    successMessage:
      "A support coordinator will review your message and reply by email.",
    consentLabel:
      "I agree that SteadyDesk IT may use these details to respond to my request.",
  },
  footer: {
    text: "Reliable day-to-day IT help, safer systems, and clear guidance for small teams without an internal system administrator.",
    serviceArea: "Remote support for small businesses across the United States.",
    copyright: "All rights reserved.",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
