import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Web Aayo Admin", template: "%s | Web Aayo Admin" }, description: "Web Aayo business administration workspace", robots: { index: false, follow: false }, icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><body>{children}<Toaster richColors position="top-right" /></body></html>; }
