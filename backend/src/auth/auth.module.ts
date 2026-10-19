import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JwtAuthGuard, PermissionsGuard } from "./auth.guard";
import { AdminSchema, LoginAttemptSchema, PermissionSchema, RoleSchema, SessionSchema } from "./auth.schemas";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({ imports: [ConfigModule, PassportModule, JwtModule.registerAsync({ inject: [ConfigService], useFactory: (config: ConfigService) => ({ secret: config.getOrThrow("JWT_ACCESS_SECRET") }) }), MongooseModule.forFeature([{ name: "Admin", schema: AdminSchema }, { name: "Role", schema: RoleSchema }, { name: "Permission", schema: PermissionSchema }, { name: "Session", schema: SessionSchema }, { name: "LoginAttempt", schema: LoginAttemptSchema }])], controllers: [AuthController], providers: [AuthService, JwtStrategy, JwtAuthGuard, PermissionsGuard], exports: [AuthService, JwtAuthGuard, PermissionsGuard, JwtModule, MongooseModule] })
export class AuthModule {}
