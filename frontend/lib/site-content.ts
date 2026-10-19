import type { BlogPost, PricingPackage, Service } from "./types";

export const defaultServices: Service[] = [
  { slug: "website-development", name: "Website Development", shortDescription: "Fast, accessible websites engineered to turn attention into action.", description: "We plan, design and build conversion-focused websites around your business goals, content and customer journey.", icon: "Code2", features: ["Responsive development", "CMS integration", "Performance optimisation", "Analytics-ready setup"], process: ["Discovery", "UX structure", "Design", "Development", "Launch"], featured: true },
  { slug: "ui-ux-design", name: "UI/UX Design", shortDescription: "Clear digital experiences that make complex journeys feel effortless.", description: "From product flows to interface systems, we create accessible experiences that look refined and work intuitively.", icon: "PanelsTopLeft", features: ["User journeys", "Wireframes", "Interface design", "Design systems"], process: ["Research", "Flows", "Wireframes", "Visual design", "Handoff"], featured: true },
  { slug: "ecommerce-development", name: "E-commerce Development", shortDescription: "Reliable storefronts designed for discovery, trust and repeat sales.", description: "We build scalable commerce experiences with practical operations, secure checkout paths and clear product storytelling.", icon: "ShoppingBag", features: ["Store architecture", "Catalog setup", "Checkout optimisation", "Operations handoff"], process: ["Planning", "Store UX", "Build", "QA", "Launch"], featured: true },
  { slug: "digital-marketing", name: "Digital Marketing", shortDescription: "Connected campaigns built around real commercial outcomes.", description: "Strategy, creative, channels and measurement work together so every activity has a reason and a next step.", icon: "Megaphone", features: ["Campaign strategy", "Content planning", "Channel execution", "Performance reporting"], process: ["Audit", "Strategy", "Creative", "Activation", "Optimisation"], featured: true },
  { slug: "seo", name: "SEO", shortDescription: "Technical and content improvements that compound over time.", description: "We improve crawlability, relevance and user experience with a practical roadmap matched to your market.", icon: "Search", features: ["Technical SEO", "Keyword strategy", "On-page optimisation", "Reporting"], process: ["Audit", "Prioritise", "Optimise", "Publish", "Measure"] },
  { slug: "social-media-management", name: "Social Media Management", shortDescription: "Consistent, useful content that keeps your brand present.", description: "We manage the planning, production and reporting rhythm behind an effective social presence.", icon: "MessagesSquare", features: ["Content calendar", "Creative production", "Community workflow", "Monthly reporting"], process: ["Position", "Plan", "Produce", "Publish", "Learn"] },
  { slug: "branding", name: "Branding", shortDescription: "A coherent identity people can recognise and remember.", description: "We clarify your positioning and translate it into a focused visual and verbal system.", icon: "Sparkles", features: ["Brand strategy", "Visual identity", "Messaging", "Guidelines"], process: ["Discover", "Position", "Explore", "Refine", "Deliver"] },
  { slug: "website-maintenance", name: "Website Maintenance", shortDescription: "Ongoing care that keeps your website secure, current and useful.", description: "A practical support plan for updates, monitoring, fixes and incremental improvement.", icon: "ShieldCheck", features: ["Security updates", "Content updates", "Performance checks", "Priority support"], process: ["Assess", "Stabilise", "Maintain", "Report"] },
];

export const defaultPackages: PricingPackage[] = [
  { slug: "starter-website", name: "Starter Website", description: "A focused online presence for a new or growing business.", currency: "NPR", priceMode: "contact", features: ["Strategy workshop", "Up to 5 core pages", "Responsive design", "Contact capture", "SEO foundations"], duration: "3–5 weeks" },
  { slug: "business-website", name: "Business Website", description: "A flexible content and lead-generation platform.", currency: "NPR", priceMode: "contact", features: ["Information architecture", "Custom UI system", "CMS", "Conversion tracking", "Launch support"], recommended: true, duration: "5–8 weeks" },
  { slug: "custom-growth", name: "Custom Digital Solution", description: "For commerce, web applications and multi-channel growth.", currency: "NPR", priceMode: "contact", features: ["Technical discovery", "Custom scope", "Integration planning", "QA and documentation", "Ongoing optimisation"], duration: "Scoped together" },
];

export const defaultPosts: BlogPost[] = [];

export const navItems = [
  ["Home", "/"], ["Services", "/services"], ["Work", "/work"], ["Pricing", "/pricing"],
  ["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"],
] as const;
