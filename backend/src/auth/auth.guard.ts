import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { PERMISSIONS_KEY } from "@/common/permissions.decorator";
import type { JwtUser } from "./auth.service";
import { resources } from "@/resources/resource.config";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class PermissionsGuard implements CanActivate { constructor(private readonly reflector: Reflector) {} canActivate(context: ExecutionContext) { const request = context.switchToHttp().getRequest<Request & { user: JwtUser; params: { resource?: string } }>(); const explicit = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]) ?? []; const action = request.method === "GET" ? "view" : request.method === "POST" ? "create" : request.method === "DELETE" ? "delete" : "update"; const config = request.params.resource ? resources[request.params.resource] : undefined; const dynamic = config ? `${config.permission}.${action}` : null; const required = explicit.length ? explicit : dynamic ? [dynamic] : []; if (request.user.roles.includes("super-admin") || required.every((permission) => request.user.permissions.includes(permission))) return true; throw new ForbiddenException("You do not have permission to perform this action"); } }
