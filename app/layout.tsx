import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import { headers } from "next/headers";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { siteConfig } from "@/app/config/site-config";
import "./globals.css";

const geist = Geist({ variable: "--font-sans", subsets: ["latin"] });
const lora = Lora({ variable: "--font-serif", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const metadataBase = host ? new URL(`${protocol}://${host}`) : new URL(siteConfig.contact.website);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: `${siteConfig.brand.siteName} | Managed IT Support for Small Businesses`,
      template: `%s | ${siteConfig.brand.siteName}`,
    },
    description: "Remote IT support, business email, device management, cloud backup, and practical cybersecurity for small businesses without internal IT staff.",
    openGraph: {
      type: "website",
      siteName: siteConfig.brand.siteName,
      title: `${siteConfig.brand.siteName} | Practical IT support for small business`,
      description: "Clear, dependable IT support for the everyday systems that keep small businesses moving.",
      images: [{ url: socialImage, width: 1731, height: 909, alt: `${siteConfig.brand.siteName} support specialist helping a small-business owner` }],
    },
    twitter: { card: "summary_large_image", images: [socialImage] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${lora.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
