import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { PremiumHero } from "@/components/premium-hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceIcon } from "@/components/service-icon";
import { getPackages, getPortfolio, getServices } from "@/lib/api";

const capabilities = ["Websites", "Digital Marketing", "SEO", "Social Media", "Branding", "Growth"];
const process = [
  { number: "01", title: "Understand", text: "We get clear on your business, audience, constraints and the outcome that matters." },
  { number: "02", title: "Shape", text: "We turn the strategy into a focused experience, system and practical delivery plan." },
  { number: "03", title: "Build", text: "Design and engineering move together, with useful checkpoints and honest progress." },
  { number: "04", title: "Grow", text: "After launch, we measure what works and keep improving the moments that drive action." },
];
const faqs = [
  ["What kinds of businesses do you work with?", "We work with ambitious small and growing businesses, established teams modernising their digital presence, and founders launching focused new products."],
  ["Can Web Aayo handle design, development and marketing?", "Yes. We can own the complete journey or plug into the part you need most. Every engagement starts with a clear scope and accountable owner."],
  ["How much does a project cost?", "Cost depends on complexity, content, integrations and timeline. We provide a clear proposal after a short discovery conversation—without inventing a package that does not fit."],
  ["Do you provide ongoing support?", "Yes. Maintenance and growth support can cover updates, performance, SEO, content, campaigns and iterative improvements after launch."],
];

export default async function Home() {
  const [services, projects, packages] = await Promise.all([getServices(), getPortfolio(), getPackages()]);
  const featuredServices = services.filter((item) => item.featured).slice(0, 6);
  return (
    <main>
      <PremiumHero />

      <section className="capability-strip" aria-label="Web Aayo capabilities"><div className="shell capability-inner"><p>One team for your digital growth</p><ul>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

      <section className="section shell home-about"><Reveal><div><p className="section-eyebrow">About Web Aayo</p><h2>One focused partner from first idea to measurable growth.</h2><p>We keep strategy, design, engineering and marketing in the same conversation. That creates clearer decisions, fewer handoffs and digital work that feels coherent from the first click onward.</p><Link className="text-link" href="/about">Meet Web Aayo <ArrowRight size={17} /></Link></div></Reveal><Reveal className="about-values"><article><strong>Clarity</strong><span>Business goals stay visible in every decision.</span></article><article><strong>Craft</strong><span>Thoughtful details without unnecessary complexity.</span></article><article><strong>Momentum</strong><span>Useful progress, shared openly and improved over time.</span></article></Reveal></section>

      <section className="section shell home-services" id="services">
        <Reveal><div className="section-topline"><SectionHeading eyebrow="What we do" title="The right digital system, not a pile of deliverables." body="We connect strategy, creative and technology around the customer journey so every part has a job to do." /><Link className="text-link" href="/services">Explore all services <ArrowRight size={17} /></Link></div></Reveal>
        <div className="services-grid">{featuredServices.map((service, index) => <Reveal key={service.slug} className={`service-card ${index === 0 ? "service-card-featured" : ""}`}><div className="service-card-top"><span className="service-icon"><ServiceIcon name={service.icon} /></span><span className="service-index">0{index + 1}</span></div><h3>{service.name}</h3><p>{service.shortDescription}</p><Link href={`/services/${service.slug}`} aria-label={`Learn more about ${service.name}`}>Learn more <ChevronRight size={16} /></Link></Reveal>)}</div>
      </section>

      <section className="section section-ink">
        <div className="shell">
          <Reveal><SectionHeading eyebrow="How we work" title="Small, senior and close to the work." body="A straightforward process keeps decisions clear, momentum visible and quality high from the first conversation to launch." /></Reveal>
          <div className="process-grid">{process.map((step) => <Reveal key={step.number} className="process-step"><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></Reveal>)}</div>
        </div>
      </section>

      {projects.length > 0 && <section className="section shell"><Reveal><div className="section-topline"><SectionHeading eyebrow="Selected work" title="Work shaped around real business outcomes." /><Link className="text-link" href="/work">See all work <ArrowRight size={17} /></Link></div></Reveal><div className="work-grid">{projects.slice(0, 3).map((project) => <Reveal key={project.slug} className="work-card"><div className="work-media">{project.imageUrl ? <Image src={project.imageUrl} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /> : <div className="work-placeholder"><span>Web Aayo</span></div>}</div><div className="work-card-copy"><p>{project.industry ?? "Digital experience"}</p><h3>{project.title}</h3><span>{project.services.join(" · ")}</span></div><Link href={`/work/${project.slug}`} aria-label={`View ${project.title}`} /></Reveal>)}</div></section>}

      <section className="section section-soft"><div className="shell"><Reveal><SectionHeading eyebrow="Engagements" title="A clear starting point. A scope built for you." body="We show pricing when it is meaningful. Every proposal spells out what is included, what success looks like and what happens next." align="center" /></Reveal><div className="pricing-grid">{packages.slice(0, 3).map((plan) => <Reveal key={plan.slug} className={`pricing-card ${plan.recommended ? "pricing-card-recommended" : ""}`}>{plan.recommended && <span className="recommended-label">Most flexible</span>}<p className="plan-kicker">{plan.duration}</p><h3>{plan.name}</h3><p>{plan.description}</p><div className="plan-price">{plan.priceMode === "contact" ? "Scoped to fit" : `${plan.currency} ${plan.startingPrice?.toLocaleString()}`}</div><ul>{plan.features.map((feature) => <li key={feature}><CheckCircle2 size={17} />{feature}</li>)}</ul><Link className={plan.recommended ? "button" : "button button-secondary"} href="/get-a-quote">Discuss your project</Link></Reveal>)}</div></div></section>

      <section className="privacy-home"><div className="shell"><Reveal className="privacy-home-copy"><div className="privacy-icon"><ShieldCheck /></div><div><p className="section-eyebrow">Privacy by design</p><h2>Your information stays yours.</h2><p>We collect only what helps us respond, deliver the work and improve the experience. We do not sell personal information, and important administrative actions are protected by role-based access and audit history.</p></div><div className="privacy-points"><span><LockKeyhole />Secure handling</span><span><CheckCircle2 />No data selling</span><Link href="/privacy">Read our privacy policy <ArrowRight /></Link></div></Reveal></div></section>

      <section className="section shell faq-layout"><Reveal><SectionHeading eyebrow="Good to know" title="Questions before we begin." body="If you need a more specific answer, tell us what you are working on and we will come back with a clear next step." /></Reveal><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="section shell"><Reveal className="final-cta"><div><p className="section-eyebrow">Ready when you are</p><h2>Let’s build the next useful thing for your business.</h2></div><div><p>Share the goal, the challenge and where you are now. We’ll help define the clearest route forward.</p><Link className="button button-light" href="/get-a-quote">Start a conversation <ArrowRight size={18} /></Link></div></Reveal></section>
    </main>
  );
}
