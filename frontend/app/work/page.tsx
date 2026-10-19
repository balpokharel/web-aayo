import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPortfolio } from "@/lib/api";

export const metadata: Metadata = { title: "Work", description: "Selected Web Aayo website, product and digital growth work." };
export default async function WorkPage() { const projects = await getPortfolio(); return <main><PageHero eyebrow="Our work" title="Digital work with a clear reason to exist." body="A selection of strategy, design, development and growth engagements published by the Web Aayo team." /><section className="section shell">{projects.length === 0 ? <div className="public-empty"><FolderKanban size={34} /><h2>Selected work is being prepared.</h2><p>Case studies will appear here as the Web Aayo team publishes them from the admin portal.</p><Link className="button" href="/get-a-quote">Discuss your project <ArrowRight size={17} /></Link></div> : <div className="portfolio-directory">{projects.map((project) => <article key={project.slug}><div className="portfolio-image">{project.imageUrl ? <Image src={project.imageUrl} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /> : <span>Web Aayo</span>}</div><div><p>{project.industry ?? "Digital experience"}</p><h2>{project.title}</h2><span>{project.description}</span><Link href={`/work/${project.slug}`}>Read case study <ArrowRight size={16} /></Link></div></article>)}</div>}</section></main>; }
