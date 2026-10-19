"use client";

import { ArrowUp, Bot, MessageCircle, Sparkles, UserRound, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
type ChatMessage = { _id?: string; sender: "visitor" | "assistant" | "admin" | "system"; senderName?: string; text: string; createdAt?: string };
type ApiResponse<T> = { success: boolean; data: T };
type TypingEvent = { active: boolean; messageId?: string; conversationId?: string; sender: "assistant" | "admin"; senderName?: string; text?: string; durationMs?: number };

const localAnswers = [
  { terms: ["service", "offer", "help", "do"], answer: "Web Aayo combines website design and development, e-commerce, SEO, digital marketing, social media, branding and ongoing growth support. Tell me what result you want and I’ll suggest a starting point." },
  { terms: ["price", "pricing", "cost", "budget", "package"], answer: "Pricing depends on scope, integrations, content and timing. The Pricing page explains our engagement options, and a short discovery call leads to a clear, itemised proposal." },
  { terms: ["time", "timeline", "long", "deadline", "launch"], answer: "Timelines depend on project size, content readiness and integrations. Web Aayo agrees milestones before work starts and keeps progress visible. Share your target date and project type for a more useful estimate." },
  { terms: ["website", "design", "development", "redesign"], answer: "Website projects can include strategy, UX, visual design, responsive development, speed, SEO foundations, analytics and launch support—all shaped around a business goal." },
  { terms: ["seo", "google", "rank", "search"], answer: "Web Aayo supports technical SEO, content structure, local visibility, keyword opportunities and ongoing measurement, focusing on durable growth rather than quick tricks." },
  { terms: ["marketing", "social", "campaign", "ads", "content"], answer: "We can connect campaigns, social content, landing pages, analytics and conversion improvements so the website and marketing work as one system." },
  { terms: ["about", "team", "company", "aayo"], answer: "Web Aayo is a close digital partner based in Nepal and working remotely worldwide. Strategy, design, engineering and growth stay in one conversation with clear ownership." },
  { terms: ["privacy", "data", "secure", "security"], answer: "Web Aayo uses submitted information to respond, deliver services, protect the platform and improve the website. We do not sell personal information. You can read the full Privacy page from the footer." },
  { terms: ["contact", "email", "phone", "whatsapp", "talk"], answer: "You can use the Contact page, request a quote, or choose ‘Talk to a person’ here. You can also email hello@webaayo.com." },
];

function localReply(text: string) {
  const input = text.toLowerCase();
  const ranked = localAnswers.map((entry) => ({ ...entry, score: entry.terms.reduce((total, term) => total + (input.includes(term) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  if (/^(hi|hello|hey|namaste)[!. ]*$/i.test(text.trim())) return "Hello! Ask me about Web Aayo’s services, pricing, process, timelines or starting a project.";
  return ranked[0].score ? ranked[0].answer : "I can answer questions about Web Aayo’s services, pricing, process, timelines, work and privacy. Add a little more detail, or choose ‘Talk to a person’ to send this conversation to the team.";
}

function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]) {
  const seen = new Set(current.map((message) => message._id).filter(Boolean));
  return [...current, ...incoming.filter((message) => !message._id || !seen.has(message._id))];
}

function replyDuration(text: string) { return Math.min(4_800, Math.max(1_400, 900 + text.length * 14)); }

function TypingReply({ event }: { event: TypingEvent }) {
  const [visible, setVisible] = useState("");
  useEffect(() => {
    const text = event.text ?? "";
    if (!text) { setVisible(""); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(text); return; }
    setVisible("");
    let position = 0;
    const interval = window.setInterval(() => {
      position = Math.min(text.length, position + 1);
      setVisible(text.slice(0, position));
      if (position >= text.length) window.clearInterval(interval);
    }, Math.max(14, Math.floor((event.durationMs ?? replyDuration(text)) / Math.max(text.length, 1))));
    return () => window.clearInterval(interval);
  }, [event.messageId, event.text, event.durationMs]);
  const label = event.sender === "admin" ? event.senderName || "Web Aayo team" : "Web Aayo Assistant";
  return <div className={`chat-message chat-message-${event.sender} chat-message-typing`} aria-hidden="true"><span><Bot /></span><div><small>{label} is typing…</small><p>{event.text ? <>{visible}<i className="chat-caret" /></> : <span className="chat-inline-dots"><i /><i /><i /></span>}</p></div></div>;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false); const [sessionId, setSessionId] = useState(""); const [messages, setMessages] = useState<ChatMessage[]>([]); const [input, setInput] = useState(""); const [sending, setSending] = useState(false); const [online, setOnline] = useState(false); const [typing, setTyping] = useState<TypingEvent | null>(null); const socketRef = useRef<Socket | null>(null); const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const id = localStorage.getItem("wa-chat-session") ?? crypto.randomUUID(); localStorage.setItem("wa-chat-session", id); setSessionId(id);
    const greeting: ChatMessage = { sender: "assistant", senderName: "Web Aayo Assistant", text: "Hi! Ask me anything about Web Aayo, or I can connect you with our team." };
    fetch(`${API_URL}/api/v1/public/chat/sessions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: id, page: location.pathname }) }).then(async (response) => { if (!response.ok) throw new Error(); return response.json() as Promise<ApiResponse<{ messages: ChatMessage[] }>>; }).then((payload) => setMessages(payload.data.messages)).catch(() => setMessages([greeting]));
    const socket = io(`${API_URL}/chat`, { auth: { sessionId: id }, withCredentials: true, transports: ["websocket", "polling"], reconnectionDelayMax: 5000 }); socketRef.current = socket;
    socket.on("connect", () => setOnline(true)); socket.on("disconnect", () => setOnline(false));
    socket.on("chat:typing", (event: TypingEvent) => setTyping((current) => event.active ? event : !event.messageId || current?.messageId === event.messageId ? null : current));
    socket.on("chat:message", (message: ChatMessage) => { setTyping((current) => !current?.messageId || current.messageId === message._id || current.sender === message.sender ? null : current); setMessages((current) => mergeMessages(current, [message])); });
    return () => { socket.disconnect(); socketRef.current = null; };
  }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open, typing]);
  const revealReply = useCallback(async (message: ChatMessage) => {
    const durationMs = replyDuration(message.text); const event: TypingEvent = { active: true, messageId: message._id, sender: message.sender === "admin" ? "admin" : "assistant", senderName: message.senderName, text: message.text, durationMs };
    setTyping(event); await new Promise((resolve) => window.setTimeout(resolve, durationMs)); setMessages((current) => mergeMessages(current, [message])); setTyping(null);
  }, []);
  useEffect(() => {
    if (!open || !sessionId || online) return;
    let cancelled = false;
    const refresh = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/public/chat/${encodeURIComponent(sessionId)}`);
        if (!response.ok) return;
        const payload = await response.json() as ApiResponse<{ messages: ChatMessage[] }>;
        const known = new Set(messages.map((message) => message._id).filter(Boolean));
        const replies = payload.data.messages.filter((message) => message.sender === "admin" && message._id && !known.has(message._id));
        for (const message of replies) {
          if (cancelled) return;
          await revealReply(message);
        }
      } catch { /* Keep the local assistant usable while the API reconnects. */ }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 4_000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [messages, online, open, revealReply, sessionId]);
  const send = async (event?: FormEvent, preset?: string) => {
    event?.preventDefault(); const text = (preset ?? input).trim(); if (!text || sending || !sessionId) return; setInput(""); setSending(true);
    if (socketRef.current?.connected) { socketRef.current.emit("visitor:message", { text, page: location.pathname }, () => setSending(false)); setTimeout(() => setSending(false), 5000); return; }
    setMessages((current) => [...current, { sender: "visitor", text }]);
    try { const response = await fetch(`${API_URL}/api/v1/public/chat/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, text, page: location.pathname }) }); if (!response.ok) throw new Error(); const payload = await response.json() as ApiResponse<{ messages: ChatMessage[] }>; for (const message of payload.data.messages.filter((item) => item.sender !== "visitor")) await revealReply(message); }
    catch { const message: ChatMessage = { sender: "assistant", senderName: "Web Aayo Assistant", text: /human|person|agent|admin|live chat/i.test(text) ? "Live chat needs the Web Aayo service to be online. You can still reach the team through the Contact page or at hello@webaayo.com." : localReply(text) }; await revealReply(message); }
    finally { setSending(false); }
  };
  return <div className={`chat-widget ${open ? "chat-widget-open" : ""}`}>
    {open && <section className="chat-panel" aria-label="Chat with Web Aayo">
      <header><div className="chat-avatar"><Sparkles /></div><div><strong>Ask Web Aayo</strong><span><i className={online ? "online" : ""} />AI answers · human support</span></div><button onClick={() => setOpen(false)} aria-label="Close chat"><X /></button></header>
      <div className="chat-messages" aria-live="polite">{messages.map((message, index) => <div className={`chat-message chat-message-${message.sender}`} key={message._id ?? `${message.sender}-${index}`}><span>{message.sender === "visitor" ? <UserRound /> : <Bot />}</span><div><small>{message.sender === "admin" ? message.senderName ?? "Web Aayo team" : message.sender === "visitor" ? "You" : "Web Aayo Assistant"}</small><p>{message.text}</p></div></div>)}{typing ? <TypingReply event={typing} /> : sending && <div className="chat-typing" aria-label="Web Aayo is preparing a reply"><i /><i /><i /></div>}<div ref={bottomRef} /></div>
      {messages.length < 4 && <div className="chat-suggestions"><button onClick={() => void send(undefined, "What services do you offer?")}>Services</button><button onClick={() => void send(undefined, "How does pricing work?")}>Pricing</button><button onClick={() => void send(undefined, "I want to talk to a person")}>Talk to a person</button></div>}
      <form onSubmit={send}><input value={input} onChange={(event) => setInput(event.target.value)} maxLength={1500} placeholder="Ask about Web Aayo…" aria-label="Chat message" /><button disabled={!input.trim() || sending} aria-label="Send message"><ArrowUp /></button></form>
      <footer>Messages are stored securely so the team can continue the conversation.</footer>
    </section>}
    <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close chat" : "Chat with Web Aayo"}>{open ? <X /> : <MessageCircle />}<span>Chat with us</span></button>
  </div>;
}
