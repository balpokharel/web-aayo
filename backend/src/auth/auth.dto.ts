import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
export class LoginDto { @IsEmail() email!: string; @IsString() @MinLength(8) @MaxLength(200) password!: string; @IsOptional() @IsString() turnstileToken?: string; @IsOptional() @IsUUID() deviceId?: string; }
export class RefreshDto { @IsOptional() @IsUUID() deviceId?: string; }
