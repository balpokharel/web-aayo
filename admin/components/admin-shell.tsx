"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Command, LogOut, Menu, Moon, Plus, Search, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, type AdminUser } from "@/lib/api";
import { navigation } from "@/lib/navigation";
import { CommandPalette } from "./command-palette";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const [open, setOpen] = useState(false); const [commandOpen, setCommandOpen] = useState(false); const [dark, setDark] = useState(false); const [user, setUser] = useState<AdminUser | null>(null);
  useEffect(() => { if (pathname !== "/admin/login") adminApi.me().then(setUser).catch(() => undefined); }, [pathname]);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); } }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, []);
  useEffect(() => { const stored = localStorage.getItem("wa-admin-theme"); const shouldDark = stored === "dark" || (!stored && matchMedia("(prefers-color-scheme: dark)").matches); setDark(shouldDark); document.documentElement.classList.toggle("dark", shouldDark); }, []);
  if (pathname === "/admin/login") return <>{children}</>;
  const toggleTheme = () => { const next = !dark; setDark(next); document.documentElement.classList.toggle("dark", next); localStorage.setItem("wa-admin-theme", next ? "dark" : "light"); };
  const logout = async () => { await adminApi.logout().catch(() => undefined); router.push("/admin/login"); };
  return <div className="admin-root"><aside className={`admin-sidebar ${open ? "open" : ""}`}><div className="sidebar-brand"><span>W</span><div>Web Aayo<small>Business OS</small></div><button onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div><nav aria-label="Admin navigation">{navigation.map((group) => "href" in group ? <Link key={group.href} className={pathname === group.href ? "active" : ""} href={group.href} onClick={() => setOpen(false)}><group.icon />{group.label}</Link> : <section key={group.label}><p><group.icon />{group.label}</p>{group.items.map(([label, href]) => <Link key={href} className={pathname === href.split("?")[0] ? "active" : ""} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</section>)}</nav><div className="sidebar-user"><span>{user?.name?.slice(0, 1) ?? "A"}</span><div><strong>{user?.name ?? "Administrator"}</strong><small>{user?.roles?.[0]?.replace("-", " ") ?? "Secure session"}</small></div><button onClick={logout} aria-label="Log out"><LogOut /></button></div></aside>{open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation" />}<div className="admin-frame"><header className="admin-topbar"><button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button><button className="global-search" onClick={() => setCommandOpen(true)}><Search /><span>Search anything</span><kbd><Command />K</kbd></button><div className="topbar-actions"><button onClick={toggleTheme} aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button><Link href="/admin/notifications" aria-label="Notifications"><Bell /></Link><button className="profile-button"><span>{user?.name?.slice(0, 1) ?? "A"}</span><ChevronDown /></button></div></header><main className="admin-content">{children}</main></div><CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} /><Link className="mobile-create" href="/admin/leads/new"><Plus />New lead</Link></div>;
}
