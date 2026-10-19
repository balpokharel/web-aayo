import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatWidget } from "@/components/chat-widget";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://webaayo.com"),
  title: { default: "Web Aayo — Websites & Digital Growth", template: "%s | Web Aayo" },
  description: "Web Aayo designs and builds high-converting websites and digital growth systems for ambitious businesses.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "Web Aayo — Websites & Digital Growth", description: "Strategy, design, development and marketing — working as one.", type: "website" },
  twitter: { card: "summary", title: "Web Aayo — Websites & Digital Growth", description: "Strategy, design, development and marketing — working as one." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${manrope.variable} antialiased`}><AnalyticsTracker /><SiteHeader />{children}<SiteFooter /><ChatWidget /></body></html>;
}
