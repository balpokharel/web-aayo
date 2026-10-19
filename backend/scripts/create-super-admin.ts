import * as argon2 from "argon2";
import mongoose from "mongoose";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { stdin, stdout } from "node:process";
import { AdminSchema, RoleSchema } from "../src/auth/auth.schemas";

async function main() {
process.loadEnvFile?.(".env");
const output = new Writable({ write(chunk, encoding, callback) { if (!muted) stdout.write(chunk, encoding); callback(); } }); let muted = false;
const prompt = createInterface({ input: stdin, output });
const name = (await prompt.question("Name: ")).trim();
const email = (await prompt.question("Email: ")).trim().toLowerCase();
muted = true; const password = await prompt.question("Password (hidden): "); muted = false; stdout.write("\n"); prompt.close();
if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 12) throw new Error("Name, valid email and a password of at least 12 characters are required.");
const uri = process.env.MONGODB_URI; if (!uri) throw new Error("MONGODB_URI is required"); await mongoose.connect(uri);
const Role = mongoose.models.Role ?? mongoose.model("Role", RoleSchema); const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);
const role = await Role.findOne({ slug: "super-admin" }); if (!role) throw new Error("Run npm run seed first to create system roles.");
const passwordHash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 });
await Admin.updateOne({ email }, { $set: { name, email, passwordHash, roleIds: [role._id], isActive: true, failedLoginAttempts: 0 } }, { upsert: true });
console.log(`Super Admin ready for ${email}.`); await mongoose.disconnect();
}
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
