import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ServiceIcon } from "@/components/service-icon";
import { getServices } from "@/lib/api";

export const metadata: Metadata = { title: "Services", description: "Website development, design, digital marketing, SEO, social media and custom digital solutions from Web Aayo." };
export default async function ServicesPage() { const services = await getServices(); return <main><PageHero eyebrow="Services" title="Connected digital services, built around the result." body="Choose one focused capability or bring us the whole challenge. We shape the right team and scope around what your business actually needs." /><section className="section shell"><div className="directory-grid">{services.map((service, index) => <article className="directory-card" key={service.slug}><div><span className="service-icon"><ServiceIcon name={service.icon} /></span><span>0{index + 1}</span></div><h2>{service.name}</h2><p>{service.shortDescription}</p><ul>{service.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul><Link href={`/services/${service.slug}`}>Explore service <ArrowRight size={17} /></Link></article>)}</div></section></main>; }
