import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { AuthService, type JwtUser } from "./auth.service";
import { JwtAuthGuard } from "./auth.guard";
import { LoginDto } from "./auth.dto";
import { Throttle } from "@nestjs/throttler";

type AuthRequest = Request & { user: JwtUser; cookies: Record<string, string> };
@Controller("auth")
export class AuthController { constructor(private readonly auth: AuthService, private readonly config: ConfigService) {}
  private cookieOptions(maxAge: number) { const production = this.config.get("NODE_ENV") === "production"; return { httpOnly: true, secure: production, sameSite: production ? "none" as const : "lax" as const, domain: this.config.get("COOKIE_DOMAIN") || undefined, path: "/", maxAge }; }
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) @Post("login") async login(@Body() dto: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) { const result = await this.auth.login(dto.email, dto.password, { ip: request.ip, userAgent: request.get("user-agent"), deviceId: dto.deviceId }); response.cookie("wa_access", result.access, this.cookieOptions(15 * 60_000)); response.cookie("wa_refresh", result.refresh, this.cookieOptions(this.config.get<number>("JWT_REFRESH_TTL_DAYS", 30) * 86_400_000)); return { user: result.user }; }
  @Post("refresh") async refresh(@Req() request: AuthRequest, @Res({ passthrough: true }) response: Response) { const result = await this.auth.refresh(request.cookies.wa_refresh); response.cookie("wa_access", result.access, this.cookieOptions(15 * 60_000)); response.cookie("wa_refresh", result.refresh, this.cookieOptions(this.config.get<number>("JWT_REFRESH_TTL_DAYS", 30) * 86_400_000)); return { user: result.user }; }
  @UseGuards(JwtAuthGuard) @Post("logout") async logout(@Req() request: AuthRequest, @Res({ passthrough: true }) response: Response) { response.clearCookie("wa_access", this.cookieOptions(0)); response.clearCookie("wa_refresh", this.cookieOptions(0)); return this.auth.logout(request.user.sid); }
  @UseGuards(JwtAuthGuard) @Post("logout-all") async logoutAll(@Req() request: AuthRequest, @Res({ passthrough: true }) response: Response) { response.clearCookie("wa_access", this.cookieOptions(0)); response.clearCookie("wa_refresh", this.cookieOptions(0)); return this.auth.logout(request.user.sid, true, request.user.sub); }
  @UseGuards(JwtAuthGuard) @Get("me") me(@Req() request: AuthRequest) { return request.user; }
  @UseGuards(JwtAuthGuard) @Get("sessions") sessions(@Req() request: AuthRequest) { return this.auth.listSessions(request.user.sub); }
}
