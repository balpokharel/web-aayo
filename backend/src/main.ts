import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression = require("compression");
import cookieParser = require("cookie-parser");
import type { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { GlobalExceptionFilter } from "./common/exception.filter";
import { ResponseInterceptor } from "./common/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService); const logger = app.get(Logger); app.useLogger(logger);
  if (config.get("TRUST_PROXY") === "true") app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.setGlobalPrefix("api/v1");
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(compression()); app.use(cookieParser());
  app.use((request: Request, response: Response, next: NextFunction) => { if (request.headers["content-length"] && Number(request.headers["content-length"]) > 1_000_000) { response.status(413).json({ success: false, message: "Request is too large", errors: [] }); return; } next(); });
  const origins = [config.getOrThrow<string>("FRONTEND_URL"), config.getOrThrow<string>("ADMIN_URL")];
  app.enableCors({ origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => callback(null, !origin || origins.includes(origin)), credentials: true, methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id", "X-CSRF-Token"], exposedHeaders: ["X-Request-Id"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: false }));
  app.useGlobalInterceptors(new ResponseInterceptor()); app.useGlobalFilters(new GlobalExceptionFilter(logger));
  if (config.get("SWAGGER_ENABLED") === "true") { const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle("Web Aayo API").setDescription("Versioned API for the Web Aayo website and administration platform").setVersion("1.0").addCookieAuth("wa_access").build()); SwaggerModule.setup("api/docs", app, document); }
  app.enableShutdownHooks();
  await app.listen(config.get<number>("PORT", 4000), "0.0.0.0");
  logger.log(`Web Aayo API listening on ${config.get<number>("PORT", 4000)}`);
}

void bootstrap();
