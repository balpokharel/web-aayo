import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Contact", description: "Contact Web Aayo about websites, digital marketing, SEO, branding or a custom digital project." };
export default function ContactPage() { return <main><PageHero eyebrow="Contact" title="Tell us what needs to move." body="A project, a problem or just an early idea—we’ll help identify the clearest next step." /><section className="section shell contact-layout"><div><p className="section-eyebrow">Reach us directly</p><h2>Prefer a quick conversation?</h2><div className="contact-cards"><a href="mailto:hello@webaayo.com"><Mail /><span>Email<strong>hello@webaayo.com</strong></span></a><a href="tel:+9770000000000"><Phone /><span>Phone<strong>Configured in admin</strong></span></a><a href="https://wa.me/9770000000000"><MessageCircle /><span>WhatsApp<strong>Configured in admin</strong></span></a><div><MapPin /><span>Location<strong>Nepal · Remote worldwide</strong></span></div><div><Clock3 /><span>Business hours<strong>Configured in admin</strong></span></div></div></div><ContactForm /></section></main>; }
