import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

@Injectable()
export class RequestIdMiddleware implements NestMiddleware { use(request: Request & { id?: string }, response: Response, next: NextFunction) { const incoming = request.header("x-request-id"); request.id = incoming && /^[a-zA-Z0-9_-]{8,80}$/.test(incoming) ? incoming : randomUUID(); response.setHeader("x-request-id", request.id); next(); } }
