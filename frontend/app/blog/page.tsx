import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPosts } from "@/lib/api";

export const metadata: Metadata = { title: "Ideas", description: "Practical thinking on websites, digital marketing, SEO, design and business growth from Web Aayo." };
export default async function BlogPage() { const posts = await getPosts(); return <main><PageHero eyebrow="Ideas" title="Useful thinking for building and growing online." body="Practical notes from the Web Aayo team on digital strategy, websites, content and sustainable growth." /><section className="section shell">{posts.length === 0 ? <div className="public-empty"><BookOpen size={34} /><h2>Our first articles are on the way.</h2><p>Published ideas will appear here automatically from the Web Aayo content workspace.</p><Link className="button" href="/contact">Ask us a question <ArrowRight size={17} /></Link></div> : <div className="blog-grid">{posts.map((post) => <article key={post.slug}><p>{post.category ?? "Insight"}</p><h2>{post.title}</h2><span>{post.excerpt}</span><footer>{post.publishedAt && <time>{new Date(post.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>}<Link href={`/blog/${post.slug}`}>Read article <ArrowRight size={16} /></Link></footer></article>)}</div>}</section></main>; }
