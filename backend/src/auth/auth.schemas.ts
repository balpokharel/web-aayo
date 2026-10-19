import { Schema } from "mongoose";

export const AdminSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false }, roleIds: [{ type: Schema.Types.ObjectId, ref: "Role", index: true }],
  isActive: { type: Boolean, default: true, index: true }, failedLoginAttempts: { type: Number, default: 0 }, lockUntil: Date,
  lastLoginAt: Date, lastLoginIp: String, twoFactorEnabled: { type: Boolean, default: false }, twoFactorSecretEncrypted: { type: String, select: false },
}, { timestamps: true, collection: "admins", strict: "throw" });
AdminSchema.index({ createdAt: -1 });

export const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, required: true, unique: true, lowercase: true },
  description: String, permissions: [{ type: String, trim: true }], isSystem: { type: Boolean, default: false }, isActive: { type: Boolean, default: true },
}, { timestamps: true, collection: "roles", strict: "throw" });

export const PermissionSchema = new Schema({ key: { type: String, required: true, unique: true }, group: { type: String, required: true }, description: String }, { timestamps: true, collection: "permissions", strict: "throw" });

export const SessionSchema = new Schema({
  adminId: { type: Schema.Types.ObjectId, ref: "Admin", required: true, index: true }, tokenHash: { type: String, required: true, select: false },
  deviceId: { type: String, required: true, index: true }, userAgent: String, ip: String, lastSeenAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: true }, revokedAt: Date, revokeReason: String,
}, { timestamps: true, collection: "sessions", strict: "throw" });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); SessionSchema.index({ adminId: 1, revokedAt: 1 });

export const LoginAttemptSchema = new Schema({ email: { type: String, index: true }, success: Boolean, ip: String, userAgent: String, reason: String }, { timestamps: true, collection: "login_attempts", strict: "throw" });
LoginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });
