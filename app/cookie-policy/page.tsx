import type { Metadata } from "next";
import { LegalPage } from "@/app/components/LegalPage";
import { siteConfig } from "@/app/config/site-config";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return <LegalPage title="Cookie Policy" intro="This page explains the limited browser storage that may be used when you visit the SteadyDesk IT website.">
    <h2>1. What cookies are</h2><p>Cookies are small data files that a website may place in a browser. Similar technologies can remember preferences, maintain security, or measure how a site is used.</p>
    <h2>2. Cookies used by this site</h2><p>We design this website to work without advertising cookies. Essential hosting or security technology may use short-lived identifiers needed to deliver pages, balance traffic, prevent abuse, or maintain a form session.</p>
    <h2>3. Analytics and advertising</h2><p>We do not currently use behavior-based advertising cookies on this website. If optional analytics or advertising tools are added later, this policy and any required consent control will be updated before those tools are enabled.</p>
    <h2>4. Managing browser storage</h2><p>You can remove or block cookies using your browser settings. Blocking essential storage may affect security checks or the reliable operation of forms.</p>
    <h2>5. Changes and questions</h2><p>We may update this policy when the website changes. Questions may be sent to <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
  </LegalPage>;
}
