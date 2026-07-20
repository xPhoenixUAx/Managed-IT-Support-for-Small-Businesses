import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";
import { siteConfig } from "@/app/config/site-config";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" intro="These terms govern use of the SteadyDesk IT website. Specific services are provided under a separate written scope or service agreement.">
    <h2>1. Website purpose</h2><p>This website provides general information about {siteConfig.brand.companyName} and allows visitors to request support, service information, advertising or partnership contact, and other information.</p>
    <h2>2. No automatic service relationship</h2><p>Submitting a form does not create a client relationship, guarantee availability, or authorize us to access a device or account. Service begins only after scope, timing, responsibilities, and applicable fees are agreed.</p>
    <h2>3. Acceptable use</h2><p>You agree not to misuse the website, interfere with its operation, submit unlawful or harmful content, impersonate another person, or attempt unauthorized access to systems or information.</p>
    <h2>4. Information and recommendations</h2><p>Website content is general educational information, not a complete assessment of your environment. Technology and security recommendations depend on the facts of each business and may change as products, threats, and requirements evolve.</p>
    <h2>5. Intellectual property</h2><p>The site design, original text, graphics, and branding are owned by or licensed to {siteConfig.brand.companyName} and may not be reproduced for commercial use without permission.</p>
    <h2>6. Third-party services</h2><p>The website may reference third-party products or websites. Those services operate under their own terms and privacy practices. A reference does not guarantee availability, performance, or suitability.</p>
    <h2>7. Availability and liability</h2><p>We aim to keep the website accurate and available but do not promise uninterrupted access. To the extent permitted by law, we are not liable for decisions made solely from general website content or for indirect losses arising from website use.</p>
    <h2>8. Contact</h2><p>Questions about these terms may be sent to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
  </LegalPage>;
}
