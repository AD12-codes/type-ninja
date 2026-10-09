import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const MIN_SECRET_LENGTH = 32;

const optionalString = z.string().min(1).optional();

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		PORT: z.coerce.number().int().positive().default(9797),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(MIN_SECRET_LENGTH),
		/** Public URL of the API (same as the site URL in single-container deploys). */
		BETTER_AUTH_URL: z.url(),
		/** Web origin allowed to call the API. Omit when the API serves the web build. */
		CORS_ORIGIN: z.url().optional(),
		/** Absolute path of the built web app to serve statically (production). */
		WEB_DIST_DIR: optionalString,
		/** Seed algorithms + explanations into the database on boot. */
		SEED_ON_START: z
			.enum(["true", "false"])
			.default("true")
			.transform((v) => v === "true"),
		RUN_MIGRATIONS_ON_START: z
			.enum(["true", "false"])
			.default("true")
			.transform((v) => v === "true"),
		GITHUB_CLIENT_ID: optionalString,
		GITHUB_CLIENT_SECRET: optionalString,
		GOOGLE_CLIENT_ID: optionalString,
		GOOGLE_CLIENT_SECRET: optionalString,
		SMTP_HOST: optionalString,
		SMTP_PORT: z.coerce.number().int().positive().optional(),
		SMTP_USER: optionalString,
		SMTP_PASS: optionalString,
		SMTP_FROM: optionalString,
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

export type ServerEnv = typeof env;
