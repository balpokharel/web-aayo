import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection } from "mongoose";
import { isValidObjectId } from "mongoose";
import type { JwtUser } from "@/auth/auth.service";
import type { ChatMessageDto, ChatSessionDto } from "./public.dto";

type Conversation = { _id: unknown; sessionId: string; status: string; visitorName?: string; visitorEmail?: string; page?: string };

const answers = [
  { words: ["service", "offer", "do", "help"], reply: "Web Aayo brings website design and development, e-commerce, SEO, digital marketing, social media, branding and ongoing growth support into one connected team. Tell me what outcome you need and I’ll point you to the best starting place." },
  { words: ["price", "pricing", "cost", "budget", "package"], reply: "Pricing is shaped around scope, complexity, integrations and timing. Our Pricing page explains the engagement options, and a short discovery conversation lets us give you a clear, itemised proposal without forcing your project into the wrong package." },
  { words: ["time", "timeline", "long", "launch", "deadline"], reply: "Timelines depend on the size of the site, content readiness and integrations. We confirm milestones before work begins and keep progress visible throughout. Share your target date and project type and the team can recommend a realistic plan." },
  { words: ["website", "web", "development", "design", "redesign"], reply: "Our website work covers strategy, UX, visual design, responsive development, performance, SEO foundations, analytics and launch support. We can build a new site or improve an existing one around measurable business goals." },
  { words: ["seo", "search", "google", "rank"], reply: "Web Aayo can help with technical SEO, content structure, keyword opportunities, local visibility, measurement and ongoing improvement. We focus on useful, sustainable growth rather than short-lived tactics." },
  { words: ["marketing", "social", "campaign", "ads", "content"], reply: "Our growth work can connect campaigns, social content, landing pages, analytics and conversion improvements so marketing and the website reinforce each other. The exact mix is shaped around your audience and goals." },
  { words: ["ecommerce", "e-commerce", "shop", "store", "payment"], reply: "We build conversion-focused online stores with product structure, checkout, payment and operational integrations planned together. Tell me what you sell and whether you already have a platform in mind." },
  { words: ["about", "team", "company", "aayo"], reply: "Web Aayo is a focused digital partner based in Nepal and working remotely with businesses worldwide. Strategy, design, engineering and growth stay in one conversation, with clear ownership and direct communication." },
  { words: ["privacy", "data", "secure", "security"], reply: "Web Aayo uses the information you submit only to respond, deliver services, secure the platform and improve the site. We do not sell personal information. The full Privacy page explains collection, retention and your choices." },
  { words: ["contact", "email", "phone", "whatsapp", "talk"], reply: "You can use the Contact page, request a quote, or ask me to connect you with a person here. Email is available at hello@webaayo.com." },
  { words: ["work", "portfolio", "case", "client", "project"], reply: "Published case studies appear on the Work page and are managed from the Web Aayo workspace. If you share your industry or project type, the team can discuss the most relevant experience directly." },
];

@Injectable()
export class ChatService {
  constructor(@InjectConnection() private readonly connection: Connection) {}
  private conversationModel() { return this.connection.model("ChatConversation"); }
  private messageModel() { return this.connection.model("ChatMessage"); }
  private wantsHuman(text: string) { return /\b(human|person|agent|admin|representative|live chat|team member|someone)\b/i.test(text); }
  private answer(text: string) {
    const normal = text.toLowerCase();
    if (/^(hi|hello|hey|namaste|good morning|good afternoon)[!. ]*$/i.test(text.trim())) return "Hello! I’m the Web Aayo assistant. I can help with services, pricing, timelines, process, privacy or starting a project. What would you like to know?";
    const ranked = answers.map((item) => ({ ...item, score: item.words.reduce((score, word) => score + (normal.includes(word) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
    return ranked[0].score > 0 ? ranked[0].reply : "I can help with anything about Web Aayo—services, pricing, process, timelines, past work, privacy or starting a project. Try adding a little more detail, or choose ‘Talk to a person’ and I’ll send this conversation to the team.";
  }
  async start(dto: ChatSessionDto) {
    const conversation = await this.conversationModel().findOneAndUpdate({ sessionId: dto.sessionId }, { $set: { ...(dto.name ? { visitorName: dto.name } : {}), ...(dto.email ? { visitorEmail: dto.email.toLowerCase() } : {}), ...(dto.page ? { page: dto.page } : {}) }, $setOnInsert: { status: "bot", lastMessageAt: new Date() } }, { new: true, upsert: true, runValidators: true }).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation could not be created");
    let messages = await this.messageModel().find({ conversationId: conversation._id }).sort({ createdAt: 1 }).limit(100).lean();
    if (!messages.length) {
      await this.messageModel().create({ conversationId: conversation._id, sessionId: dto.sessionId, sender: "assistant", senderName: "Web Aayo Assistant", text: "Hi! I’m the Web Aayo assistant. Ask me about our services, pricing, process or your project—or I can connect you with a person." });
      messages = await this.messageModel().find({ conversationId: conversation._id }).sort({ createdAt: 1 }).limit(100).lean();
    }
    return { conversation, messages };
  }
  async publicHistory(sessionId: string) {
    const conversation = await this.conversationModel().findOne({ sessionId }).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation not found");
    const messages = await this.messageModel().find({ conversationId: conversation._id }).sort({ createdAt: 1 }).limit(200).lean();
    await this.conversationModel().updateOne({ _id: conversation._id }, { unreadByVisitor: 0 });
    return { conversation, messages };
  }
  async visitorMessage(dto: ChatMessageDto) {
    const conversation = await this.conversationModel().findOneAndUpdate({ sessionId: dto.sessionId }, { $setOnInsert: { status: "bot" }, $set: { ...(dto.page ? { page: dto.page } : {}), lastMessage: dto.text, lastMessageAt: new Date() }, $inc: { unreadByAdmin: 1 } }, { new: true, upsert: true, runValidators: true }).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation could not be created");
    const visitor = await this.messageModel().create({ conversationId: conversation._id, sessionId: dto.sessionId, sender: "visitor", senderName: conversation.visitorName || "Website visitor", text: dto.text.trim() });
    const messages: unknown[] = [visitor.toObject()];
    if (this.wantsHuman(dto.text)) {
      const assistant = await this.messageModel().create({ conversationId: conversation._id, sessionId: dto.sessionId, sender: "assistant", senderName: "Web Aayo Assistant", text: "I’ve placed this chat in the team inbox. You can keep typing here; a Web Aayo team member can join this same conversation." });
      messages.push(assistant.toObject());
      await Promise.all([
        this.conversationModel().updateOne({ _id: conversation._id }, { status: "queued", lastMessage: dto.text, lastMessageAt: new Date() }),
        this.connection.model("Notification").create({ type: "live_chat", title: "Visitor requested live chat", message: dto.text.slice(0, 180), link: "/admin/chat", metadata: { conversationId: conversation._id } }),
      ]);
    } else if (conversation.status === "bot") {
      const text = this.answer(dto.text);
      const assistant = await this.messageModel().create({ conversationId: conversation._id, sessionId: dto.sessionId, sender: "assistant", senderName: "Web Aayo Assistant", text });
      messages.push(assistant.toObject());
    }
    const updated = await this.conversationModel().findById(conversation._id).lean<Conversation>();
    return { conversation: updated ?? conversation, messages };
  }
  async adminHistory(conversationId: string) {
    if (!isValidObjectId(conversationId)) throw new BadRequestException("Invalid conversation id");
    const conversation = await this.conversationModel().findById(conversationId).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation not found");
    const messages = await this.messageModel().find({ conversationId }).sort({ createdAt: 1 }).limit(500).lean();
    await this.conversationModel().updateOne({ _id: conversationId }, { unreadByAdmin: 0 });
    return { conversation, messages };
  }
  async adminMessage(conversationId: string, text: string, actor: JwtUser) {
    if (!isValidObjectId(conversationId) || !text.trim() || text.length > 1500) throw new BadRequestException("Message is invalid");
    const conversation = await this.conversationModel().findById(conversationId).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation not found");
    const message = await this.messageModel().create({ conversationId, sessionId: conversation.sessionId, sender: "admin", senderId: actor.sub, senderName: actor.name, text: text.trim() });
    await this.conversationModel().updateOne({ _id: conversationId }, { $set: { status: "active", assignedTo: actor.sub, lastMessage: text.trim(), lastMessageAt: new Date(), unreadByAdmin: 0 }, $inc: { unreadByVisitor: 1 } });
    const updated = await this.conversationModel().findById(conversationId).lean<Conversation>();
    return { conversation: updated ?? conversation, message: message.toObject() };
  }
  async sessionIdForConversation(conversationId: string) {
    if (!isValidObjectId(conversationId)) throw new BadRequestException("Invalid conversation id");
    const conversation = await this.conversationModel().findById(conversationId).select("sessionId").lean<{ sessionId: string }>();
    if (!conversation) throw new NotFoundException("Conversation not found");
    return conversation.sessionId;
  }
  async setStatus(conversationId: string, status: string, actor: JwtUser) {
    if (!isValidObjectId(conversationId) || !["queued", "active", "resolved", "closed"].includes(status)) throw new BadRequestException("Status is invalid");
    const conversation = await this.conversationModel().findByIdAndUpdate(conversationId, { status, ...(status === "active" ? { assignedTo: actor.sub } : {}) }, { new: true }).lean<Conversation>();
    if (!conversation) throw new NotFoundException("Conversation not found");
    return conversation;
  }
}
