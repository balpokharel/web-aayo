"use client";
import { RotateCcw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="not-found shell"><p className="section-eyebrow">Something went wrong</p><h1>We couldn’t load this page.</h1><p>Your information is safe. Please try the page again.</p><button className="button" onClick={reset}><RotateCcw size={17} />Try again</button></main>; }
