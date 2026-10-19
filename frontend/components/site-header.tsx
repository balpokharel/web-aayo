"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/site-content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Web Aayo home" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">W</span><span>Web Aayo</span></Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <Link className="button button-small header-quote" href="/get-a-quote">Get a quote <ArrowRight size={16} aria-hidden="true" /></Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><div className="shell">{navItems.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight size={16} /></Link>)}<Link className="button" href="/get-a-quote" onClick={() => setOpen(false)}>Start your project</Link></div></nav>}
    </header>
  );
}
