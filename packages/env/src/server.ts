import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_LOCAL_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		POLAR_ACCESS_TOKEN: z.string().min(1),
		POLAR_SUCCESS_URL: z.url(),
		CORS_ORIGIN: z.url(),
		REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
		NODE_ENV: z.enum(["development", "production"]).default("development"),
		POLAR_WEBHOOK_SECRET: z.string().min(1),
		POLAR_PRO_M_SLUG: z.string().min(1),
		POLAR_PRO_M_PRODUCT_ID: z.string().min(1),
		POLAR_PRO_Y_SLUG: z.string().min(1),
		POLAR_PRO_Y_PRODUCT_ID: z.string().min(1),
		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		BREVO_API_KEY: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
