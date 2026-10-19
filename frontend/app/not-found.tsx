import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
export default function NotFound() { return <main className="not-found shell"><p className="section-eyebrow">404 · Page not found</p><h1>Looks like this page hasn’t arrived yet.</h1><p>The link may have changed, or the page may still be on its way.</p><div><Link className="button" href="/"><ArrowLeft size={17} />Go home</Link><Link className="button button-secondary" href="/contact"><MessageCircle size={17} />Contact Web Aayo</Link></div></main>; }
