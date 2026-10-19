import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./bootstrap";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const { config, logger } = configureApp(app);
  await app.listen(config.get<number>("PORT", 4000), "0.0.0.0");
  logger.log(`Web Aayo API listening on ${config.get<number>("PORT", 4000)}`);
}

void bootstrap();
