export function SectionHeading({ eyebrow, title, body, align = "left" }: { eyebrow: string; title: string; body?: string; align?: "left" | "center" }) {
  return <div className={`section-heading ${align === "center" ? "section-heading-center" : ""}`}><p className="section-eyebrow">{eyebrow}</p><h2>{title}</h2>{body && <p className="section-copy">{body}</p>}</div>;
}
