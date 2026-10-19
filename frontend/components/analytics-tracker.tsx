"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsTracker() {
  const pathname = usePathname();
  useEffect(() => {
    const key = "web_aayo_session";
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(key, sessionId); }
    const params = new URLSearchParams(window.location.search);
    const data = { event: "page_view", sessionId, path: pathname, source: params.get("utm_source") ?? undefined, campaign: params.get("utm_campaign") ?? undefined, referrer: document.referrer || undefined, device: window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop" };
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/v1/public/analytics/events`;
    if (navigator.sendBeacon) navigator.sendBeacon(endpoint, new Blob([JSON.stringify(data)], { type: "application/json" }));
    else fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), keepalive: true }).catch(() => undefined);
  }, [pathname]);
  return null;
}
