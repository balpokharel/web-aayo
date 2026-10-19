import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import type { Request } from "express";
import { AnalyticsDto, ChatMessageDto, ChatSessionDto, ContactDto, NewsletterDto, QuoteDto } from "./public.dto";
import { ChatService } from "./chat.service";
import { BotProtectionService } from "./bot-protection.service";
import { PublicService } from "./public.service";
import { ResourceService } from "./resource.service";

@Controller("public")
export class PublicController { constructor(private readonly resources: ResourceService, private readonly publicService: PublicService, private readonly bot: BotProtectionService, private readonly chat: ChatService) {}
  @Throttle({ default: { limit: 20, ttl: 60_000 } }) @Post("chat/sessions") startChat(@Body() dto: ChatSessionDto) { return this.chat.start(dto); }
  @Throttle({ default: { limit: 30, ttl: 60_000 } }) @Post("chat/messages") sendChat(@Body() dto: ChatMessageDto) { return this.chat.visitorMessage(dto); }
  @Throttle({ default: { limit: 60, ttl: 60_000 } }) @Get("chat/:sessionId") chatHistory(@Param("sessionId") sessionId: string) { return this.chat.publicHistory(sessionId); }
  @Get(":resource") list(@Param("resource") resource: string) { return resource === "settings" ? this.publicService.settings() : this.resources.publicList(resource); }
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post("quotes") async quote(@Body() dto: QuoteDto, @Req() request: Request) { await this.bot.verify(dto.turnstileToken, request.ip); return this.publicService.quote(dto); }
  @Throttle({ default: { limit: 8, ttl: 60_000 } }) @Post("contacts") async contact(@Body() dto: ContactDto, @Req() request: Request) { await this.bot.verify(dto.turnstileToken, request.ip); return this.publicService.contact(dto); }
  @Throttle({ default: { limit: 120, ttl: 60_000 } }) @Post("analytics/events") analytics(@Body() dto: AnalyticsDto) { return this.publicService.analytics(dto); }
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post("newsletter") async subscribe(@Body() dto: NewsletterDto, @Req() request: Request) { await this.bot.verify(dto.turnstileToken, request.ip); return this.publicService.subscribe(dto); }
}
