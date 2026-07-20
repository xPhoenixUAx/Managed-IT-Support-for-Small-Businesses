import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";
import { siteConfig } from "@/app/config/site-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" intro="This policy explains what information we collect through this website, why we use it, and the choices available to you.">
    <h2>1. Information we collect</h2><p>When you submit a form, we collect the information you provide, including your name, business email, company name, inquiry type, and message. We may also receive limited technical information needed to operate and protect the website, such as the date of a request and basic security logs.</p>
    <h2>2. How we use information</h2><p>We use submitted information to respond to technical-support requests, prepare service information, discuss advertising or partnerships, and provide the additional information you requested. We also use limited operational data to prevent abuse and maintain the website.</p>
    <h2>3. Legal basis and consent</h2><p>We process form information to take steps at your request, to communicate about a potential or existing service relationship, and on the basis of the consent you provide with the form. You may withdraw consent for future communication at any time.</p>
    <h2>4. Sharing and service providers</h2><p>We do not sell personal information. Information may be processed by providers that help us host the website, deliver email, secure systems, or provide requested support. They receive only the information needed for those purposes.</p>
    <h2>5. Retention and security</h2><p>We retain inquiries only as long as needed for communication, service records, legal requirements, and reasonable business administration. We use proportionate technical and organizational safeguards, but no internet transmission is completely risk-free.</p>
    <h2>6. Your choices</h2><p>You may ask to access, correct, or delete information associated with your inquiry, subject to applicable law and necessary business records. Contact <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
    <h2>7. Sensitive information</h2><p>Do not send passwords, one-time verification codes, recovery keys, financial account details, or other sensitive credentials through the website form or ordinary email.</p>
    <h2>8. Changes</h2><p>We may update this policy as our services or legal obligations change. The date above identifies the current version.</p>
  </LegalPage>;
}
