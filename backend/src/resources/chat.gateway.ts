import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { AuthService, type JwtUser } from "@/auth/auth.service";
import { ChatService } from "./chat.service";

function cookieValue(header: string | undefined, name: string) { return header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1); }
function wait(milliseconds: number) { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }
function typingDuration(text: string) { return Math.min(4_800, Math.max(1_400, 900 + text.length * 14)); }

type OutgoingMessage = {
  _id?: unknown;
  conversationId?: unknown;
  sender?: "visitor" | "assistant" | "admin" | "system";
  senderName?: string;
  text?: string;
};

@WebSocketGateway({ namespace: "/chat", cors: { origin: [process.env.FRONTEND_URL ?? "http://localhost:5173", process.env.ADMIN_URL ?? "http://localhost:3001"], credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;
  constructor(private readonly chat: ChatService, private readonly jwt: JwtService, private readonly auth: AuthService, private readonly config: ConfigService) {}
  async handleConnection(client: Socket) {
    const token = cookieValue(client.handshake.headers.cookie, "wa_access");
    if (token) {
      try {
        const user = await this.jwt.verifyAsync<JwtUser>(token, { secret: this.config.getOrThrow("JWT_ACCESS_SECRET") });
        if (await this.auth.isSessionActive(user.sid, user.sub) && (user.roles.includes("super-admin") || user.permissions.includes("chat.view"))) { client.data.admin = user; await client.join("admins"); return; }
      } catch { /* Continue as a public visitor if a stale cookie is present. */ }
    }
    const sessionId = String(client.handshake.auth?.sessionId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(sessionId)) { client.disconnect(true); return; }
    client.data.sessionId = sessionId;
    await client.join(`visitor:${sessionId}`);
  }
  @SubscribeMessage("visitor:message") async visitorMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { text?: string; page?: string }) {
    const sessionId = String(client.data.sessionId ?? "");
    if (!sessionId || typeof body.text !== "string") return { ok: false };
    const result = await this.chat.visitorMessage({ sessionId, text: body.text, page: body.page });
    const messages = result.messages as OutgoingMessage[];
    for (const message of messages.filter((item) => item.sender === "visitor")) {
      this.server.to(`visitor:${sessionId}`).emit("chat:message", message);
      this.server.to("admins").emit("chat:message", message);
    }
    for (const message of messages.filter((item) => item.sender !== "visitor")) {
      const text = String(message.text ?? "");
      const durationMs = typingDuration(text);
      const typing = {
        active: true,
        messageId: String(message._id ?? ""),
        conversationId: String(message.conversationId ?? result.conversation._id),
        sender: message.sender ?? "assistant",
        senderName: message.senderName ?? "Web Aayo Assistant",
        text,
        durationMs,
      };
      this.server.to(`visitor:${sessionId}`).emit("chat:typing", typing);
      this.server.to("admins").emit("chat:typing", typing);
      await wait(durationMs);
      this.server.to(`visitor:${sessionId}`).emit("chat:typing", { ...typing, active: false });
      this.server.to("admins").emit("chat:typing", { ...typing, active: false });
      this.server.to(`visitor:${sessionId}`).emit("chat:message", message);
      this.server.to("admins").emit("chat:message", message);
    }
    this.server.to("admins").emit("chat:conversation", result.conversation);
    return { ok: true };
  }
  @SubscribeMessage("admin:join") async join(@ConnectedSocket() client: Socket, @MessageBody() body: { conversationId?: string }) {
    if (!client.data.admin || !body.conversationId) return { ok: false };
    await client.join(`conversation:${body.conversationId}`);
    return { ok: true };
  }
  @SubscribeMessage("admin:message") async adminMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { conversationId?: string; text?: string }) {
    const actor = client.data.admin as JwtUser | undefined;
    if (!actor || !body.conversationId || typeof body.text !== "string") return { ok: false };
    const result = await this.chat.adminMessage(body.conversationId, body.text, actor);
    this.server.to(`visitor:${result.conversation?.sessionId}`).emit("chat:message", result.message);
    this.server.to("admins").emit("chat:message", result.message);
    this.server.to("admins").emit("chat:conversation", result.conversation);
    return { ok: true };
  }
  @SubscribeMessage("admin:typing") async adminTyping(@ConnectedSocket() client: Socket, @MessageBody() body: { conversationId?: string; active?: boolean }) {
    const actor = client.data.admin as JwtUser | undefined;
    if (!actor || !body.conversationId) return { ok: false };
    const sessionId = await this.chat.sessionIdForConversation(body.conversationId);
    this.server.to(`visitor:${sessionId}`).emit("chat:typing", {
      active: Boolean(body.active),
      conversationId: body.conversationId,
      sender: "admin",
      senderName: actor.name || "Web Aayo team",
    });
    return { ok: true };
  }
  @SubscribeMessage("admin:status") async status(@ConnectedSocket() client: Socket, @MessageBody() body: { conversationId?: string; status?: string }) {
    const actor = client.data.admin as JwtUser | undefined;
    if (!actor || !body.conversationId || !body.status) return { ok: false };
    const conversation = await this.chat.setStatus(body.conversationId, body.status, actor);
    this.server.to("admins").emit("chat:conversation", conversation);
    this.server.to(`visitor:${conversation.sessionId}`).emit("chat:status", { status: conversation.status });
    return { ok: true };
  }
}
