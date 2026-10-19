import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHero({ eyebrow, title, body, trail }: { eyebrow: string; title: string; body: string; trail?: string }) {
  return <section className="page-hero">
    <div className="page-hero-noise" aria-hidden="true" />
    <div className="shell page-hero-grid">
      <div className="page-hero-copy">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={14} />{trail && <><span>{trail}</span><ChevronRight size={14} /></>}<span aria-current="page">{eyebrow}</span></nav>
        <p className="section-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-body">{body}</p>
      </div>
      <aside className="page-hero-note" aria-hidden="true">
        <span className="page-hero-tape" />
        <p>Working note / {eyebrow}</p>
        <strong>Listen first.<br />Make it clear.<br />Build what matters.</strong>
        <div><span>01</span><i /><span>03</span></div>
        <small>Web Aayo — made together</small>
      </aside>
    </div>
  </section>;
}
