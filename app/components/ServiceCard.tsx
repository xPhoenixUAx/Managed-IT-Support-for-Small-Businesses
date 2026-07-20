import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/app/content/services";
import { ServiceIcon } from "./ServiceIcon";

export function ServiceCard({ service, index }: { service: Service; index?: number }) {
  return (
    <article className="service-card">
      <Link href={`/services/${service.slug}`} className="service-image" aria-label={`Learn about ${service.title}`}>
        <Image unoptimized src={service.image} alt={`${service.title} for a small business team`} fill sizes="(max-width: 760px) 86vw, (max-width: 1100px) 45vw, 31vw" />
        {typeof index === "number" && <span className="card-number">{String(index + 1).padStart(2, "0")}</span>}
      </Link>
      <div className="service-card-body">
        <div className="service-icon"><ServiceIcon name={service.icon} size={24} /></div>
        <p className="eyebrow">{service.eyebrow}</p>
        <h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3>
        <p>{service.summary}</p>
        <Link href={`/services/${service.slug}`} className="text-link">Explore service <ArrowUpRight size={17} /></Link>
      </div>
    </article>
  );
}
