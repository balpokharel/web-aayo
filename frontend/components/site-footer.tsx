import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { navItems } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-intro"><Link className="brand brand-light" href="/"><span className="brand-mark">W</span><span>Web Aayo</span></Link><p>Digital strategy, websites and marketing systems built to move businesses forward.</p><a className="footer-email" href="mailto:hello@webaayo.com"><Mail size={17} /> hello@webaayo.com</a></div>
        <div><h2>Explore</h2>{navItems.slice(1).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><h2>Services</h2><Link href="/services/website-development">Website Development</Link><Link href="/services/ecommerce-development">E-commerce</Link><Link href="/services/digital-marketing">Digital Marketing</Link><Link href="/services/seo">SEO</Link></div>
        <div><h2>Start</h2><Link href="/get-a-quote">Request a quote <ArrowUpRight size={14} /></Link><Link href="/contact">Talk to our team</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms</Link></div>
      </div>
      <div className="shell footer-bottom"><p>© {new Date().getFullYear()} Web Aayo. All rights reserved.</p><p>Made for businesses ready to move.</p></div>
    </footer>
  );
}
