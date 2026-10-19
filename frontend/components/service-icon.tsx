import { Code2, Megaphone, MessagesSquare, PanelsTopLeft, Search, ShieldCheck, ShoppingBag, Sparkles, Wrench } from "lucide-react";

const icons = { Code2, Megaphone, MessagesSquare, PanelsTopLeft, Search, ShieldCheck, ShoppingBag, Sparkles, Wrench };

export function ServiceIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? Wrench;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
