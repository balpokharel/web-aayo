import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService, type JwtUser } from "./auth.service";

const cookieExtractor = (request: Request) => request?.cookies?.wa_access as string | null ?? null;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { constructor(config: ConfigService, private readonly auth: AuthService) { super({ jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, ExtractJwt.fromAuthHeaderAsBearerToken()]), secretOrKey: config.getOrThrow<string>("JWT_ACCESS_SECRET") }); } async validate(payload: JwtUser) { if (!await this.auth.isSessionActive(payload.sid, payload.sub)) throw new UnauthorizedException("Session is no longer active"); return payload; } }
