import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = await getPost(slug); return post ? { title: post.title, description: post.excerpt, alternates: { canonical: `/blog/${slug}` } } : {}; }
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const post = await getPost(slug); if (!post) notFound(); return <main><article className="article-page shell"><Link className="back-link" href="/blog"><ArrowLeft size={16} />All ideas</Link><p className="section-eyebrow">{post.category ?? "Insight"}</p><h1>{post.title}</h1><p className="article-deck">{post.excerpt}</p><div className="article-meta">{post.author && <span>By {post.author}</span>}{post.publishedAt && <time>{new Date(post.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</time>}</div><div className="article-content">{post.content.split("\n\n").map((paragraph) => <p key={paragraph.slice(0, 80)}>{paragraph}</p>)}</div></article></main>; }
