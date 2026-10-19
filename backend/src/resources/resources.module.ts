import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "@/auth/auth.module";
import { businessModels } from "@/database/business.schemas";
import { ActionsController } from "./actions.controller";
import { ActionsService } from "./actions.service";
import { AdminResourcesController } from "./admin-resources.controller";
import { BotProtectionService } from "./bot-protection.service";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { ResourceService } from "./resource.service";
import { AdminChatController } from "./admin-chat.controller";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

const realtimeProviders = process.env.VERCEL ? [] : [ChatGateway];

@Module({ imports: [MongooseModule.forFeature(businessModels), AuthModule], controllers: [PublicController, AdminChatController, AdminResourcesController, ActionsController], providers: [ResourceService, PublicService, BotProtectionService, ActionsService, ChatService, ...realtimeProviders], exports: [ResourceService, ChatService] })
export class ResourcesModule {}
