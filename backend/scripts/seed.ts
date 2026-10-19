import mongoose from "mongoose";
import { AdminSchema, PermissionSchema, RoleSchema, SessionSchema } from "../src/auth/auth.schemas";
import { businessModels } from "../src/database/business.schemas";

async function main() {
process.loadEnvFile?.(".env");
if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") throw new Error("Development seed is disabled in production.");
const uri = process.env.MONGODB_URI; if (!uri) throw new Error("MONGODB_URI is required");
await mongoose.connect(uri);
mongoose.model("Admin", AdminSchema); mongoose.model("Role", RoleSchema); mongoose.model("Permission", PermissionSchema); mongoose.model("Session", SessionSchema); businessModels.forEach(({ name, schema }) => { if (!mongoose.models[name]) mongoose.model(name, schema); });

const groups: Record<string, string[]> = {
  dashboard: ["view"], leads: ["view", "create", "update", "delete", "export"], clients: ["view", "create", "update", "delete", "export"], projects: ["view", "create", "update", "delete"],
  invoices: ["view", "create", "update", "delete", "export"], payments: ["view", "create", "update", "export"], blog: ["view", "create", "update", "publish", "delete"],
  services: ["view", "create", "update", "delete"], pricing: ["view", "create", "update", "delete"], portfolio: ["view", "create", "update", "delete"], testimonials: ["view", "create", "update", "delete"],
  media: ["view", "create", "update", "delete"], analytics: ["view", "export"], campaigns: ["view", "create", "update", "delete"], landing_pages: ["view", "create", "update", "delete"],
  contacts: ["view", "update", "delete"], chat: ["view", "update"], notifications: ["view", "update"], team: ["view", "create", "update", "delete"], roles: ["view", "create", "update", "delete"], settings: ["view", "create", "update", "delete"], seo: ["view", "create", "update", "delete"], audit: ["view", "export"], support: ["view", "create", "update"], marketing: ["view", "update", "export"],
};
const permissions = Object.entries(groups).flatMap(([group, actions]) => actions.map((action) => ({ key: `${group}.${action}`, group, description: `${action} ${group.replace(/_/g, " ")}` })));
await mongoose.model("Permission").bulkWrite(permissions.map((permission) => ({ updateOne: { filter: { key: permission.key }, update: { $set: permission }, upsert: true } })));
const all = permissions.map((permission) => permission.key);
const roleSets: Record<string, string[]> = {
  "Super Admin": all, Admin: all.filter((key) => !key.startsWith("roles.") && !key.startsWith("audit.")),
  Sales: all.filter((key) => /^(dashboard|leads|clients|projects|invoices|payments)\./.test(key)), Marketing: all.filter((key) => /^(dashboard|analytics|campaigns|landing_pages|marketing|blog|media)\./.test(key)),
  "Content Manager": all.filter((key) => /^(dashboard|blog|services|portfolio|testimonials|media|seo)\./.test(key)), "Project Manager": all.filter((key) => /^(dashboard|clients|projects|support|invoices)\./.test(key)),
  Support: all.filter((key) => /^(dashboard|clients|projects|support|contacts|chat)\./.test(key)), Viewer: all.filter((key) => key.endsWith(".view")),
};
for (const [name, rolePermissions] of Object.entries(roleSets)) { const slug = name.toLowerCase().replace(/\s+/g, "-"); await mongoose.model("Role").updateOne({ slug }, { $set: { name, slug, permissions: rolePermissions, isSystem: true, isActive: true } }, { upsert: true }); }

const services = [
  ["Website Development", "website-development", "Fast, accessible websites engineered to turn attention into action.", "Code2"], ["UI/UX Design", "ui-ux-design", "Clear digital experiences that make complex journeys feel effortless.", "PanelsTopLeft"],
  ["E-commerce Development", "ecommerce-development", "Reliable storefronts designed for discovery, trust and repeat sales.", "ShoppingBag"], ["Digital Marketing", "digital-marketing", "Connected campaigns built around real commercial outcomes.", "Megaphone"],
  ["SEO", "seo", "Technical and content improvements that compound over time.", "Search"], ["Social Media Management", "social-media-management", "Consistent, useful content that keeps your brand present.", "MessagesSquare"],
  ["Branding", "branding", "A coherent identity people can recognise and remember.", "Sparkles"], ["Website Maintenance", "website-maintenance", "Ongoing care that keeps your website secure, current and useful.", "ShieldCheck"],
];
for (let index = 0; index < services.length; index++) { const [name, slug, shortDescription, icon] = services[index]; await mongoose.model("Service").updateOne({ slug }, { $set: { name, slug, shortDescription, description: shortDescription, icon, features: [], process: ["Discovery", "Plan", "Create", "Review", "Launch"], featured: index < 4, enabled: true, order: index } }, { upsert: true }); }
const settings = [{ key: "business.name", group: "business", value: "Web Aayo", isPublic: true }, { key: "business.email", group: "business", value: "hello@webaayo.com", isPublic: true }, { key: "business.timezone", group: "business", value: "Asia/Kathmandu", isPublic: true }, { key: "business.currency", group: "business", value: "NPR", isPublic: true }, { key: "whatsapp.visible", group: "contact", value: false, isPublic: true }, { key: "announcement.enabled", group: "website", value: false, isPublic: true }];
for (const setting of settings) await mongoose.model("SiteSetting").updateOne({ key: setting.key }, { $set: setting }, { upsert: true });
console.log(`Seeded ${permissions.length} permissions, ${Object.keys(roleSets).length} roles, ${services.length} services and ${settings.length} settings.`);
await mongoose.disconnect();
}
void main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
