import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = { title: { default: "Web Aayo Admin", template: "%s | Web Aayo Admin" }, description: "Web Aayo business administration workspace", robots: { index: false, follow: false }, icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><body className={inter.variable}>{children}<Toaster richColors position="top-right" /></body></html>; }
