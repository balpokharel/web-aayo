import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard, PermissionsGuard } from "@/auth/auth.guard";
import type { JwtUser } from "@/auth/auth.service";
import { RequirePermissions } from "@/common/permissions.decorator";
import { ChatService } from "./chat.service";

type AdminRequest = Request & { user: JwtUser };

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("admin/chat")
export class AdminChatController {
  constructor(private readonly chat: ChatService) {}
  @RequirePermissions("chat.view") @Get(":id/messages") messages(@Param("id") id: string) { return this.chat.adminHistory(id); }
  @RequirePermissions("chat.update") @Post(":id/messages") reply(@Param("id") id: string, @Body("text") text: string, @Req() request: AdminRequest) { return this.chat.adminMessage(id, text, request.user); }
  @RequirePermissions("chat.update") @Patch(":id/status") status(@Param("id") id: string, @Body("status") status: string, @Req() request: AdminRequest) { return this.chat.setStatus(id, status, request.user); }
}
