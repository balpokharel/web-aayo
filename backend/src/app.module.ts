import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "node:crypto";
import { AuthModule } from "./auth/auth.module";
import { RequestIdMiddleware } from "./common/request-id.middleware";
import { validateEnvironment } from "./config/environment";
import { HealthController } from "./health.controller";
import { ResourcesModule } from "./resources/resources.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    LoggerModule.forRoot({ pinoHttp: { level: process.env.NODE_ENV === "production" ? "info" : "debug", redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie", "req.body.password", "req.body.token", "req.body.turnstileToken"], genReqId: (request) => typeof request.headers["x-request-id"] === "string" ? request.headers["x-request-id"] : randomUUID() } }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ uri: config.getOrThrow("MONGODB_URI"), autoIndex: config.get("NODE_ENV") !== "production", serverSelectionTimeoutMS: 8000, maxPoolSize: 20, minPoolSize: 1, retryWrites: true }) }),
    ThrottlerModule.forRoot([{ name: "default", ttl: 60_000, limit: 100 }]),
    AuthModule,
    ResourcesModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule { configure(consumer: MiddlewareConsumer) { consumer.apply(RequestIdMiddleware).forRoutes("*"); } }
