import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1), REDIS_URL: z.string().optional(),
  JWT_ACCESS_SECRET: z.string().min(32), JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("15m"), JWT_REFRESH_TTL_DAYS: z.coerce.number().positive().default(30),
  FRONTEND_URL: z.string().url(), ADMIN_URL: z.string().url(), COOKIE_DOMAIN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(), SWAGGER_ENABLED: z.string().default("false"), TRUST_PROXY: z.string().default("false"),
  TIMEZONE: z.string().default("Asia/Kathmandu"), DEFAULT_CURRENCY: z.string().default("NPR"),
}).passthrough();

export function validateEnvironment(input: Record<string, unknown>) { const parsed = schema.safeParse(input); if (!parsed.success) throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", ")}`); return parsed.data; }
