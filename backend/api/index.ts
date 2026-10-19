import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express, { type Request, type Response } from "express";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/bootstrap";

const server = express();
let ready: Promise<void> | undefined;

function initialize() {
  ready ??= (async () => {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), { bufferLogs: true });
    configureApp(app, { shutdownHooks: false });
    await app.init();
  })();
  return ready;
}

export default async function handler(request: Request, response: Response) {
  await initialize();
  return server(request, response);
}
