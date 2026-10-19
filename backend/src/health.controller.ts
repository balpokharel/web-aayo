import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import type { Connection } from "mongoose";

@Controller("health")
export class HealthController { constructor(@InjectConnection() private readonly connection: Connection) {} @Get() check() { return { status: this.connection.readyState === 1 ? "ok" : "degraded", database: this.connection.readyState === 1 ? "connected" : "unavailable", timestamp: new Date().toISOString() }; } }
