import { getDB } from "@type-ninja/db/drizzle";
import { redisService } from "@type-ninja/db/redis";
import { accounts, users, verifications } from "@type-ninja/db/schema/auth";
import { env } from "@type-ninja/env/server";
import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export function initializeAuth() {
	if (authInstance) {
		return authInstance;
	}

	const redis = redisService.getClient();
	const db = getDB();

	const polarClient = new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		server: env.NODE_ENV === "production" ? "production" : "sandbox",
	});

	authInstance = betterAuth<BetterAuthOptions>({
		baseURL: env.BETTER_AUTH_URL,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: {
				users,
				accounts,
				verifications,
			},
		}),
		user: {
			modelName: "users",
		},
		account: {
			modelName: "accounts",
		},
		verification: {
			modelName: "verifications",
		},
		secondaryStorage: {
			get: async (key) => await redis.get(key),
			set: async (key, value, ttl) => {
				if (ttl) {
					await redis.set(key, value, "EX", ttl);
				} else {
					await redis.set(key, value);
				}
			},
			delete: async (key) => {
				await redis.del(key);
			},
		},
		trustedOrigins: [env.CORS_ORIGIN || ""],
		advanced: {
			defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				httpOnly: true,
			},
		},
		socialProviders: {
			github: {
				clientId: env.GITHUB_CLIENT_ID as string,
				clientSecret: env.GITHUB_CLIENT_SECRET as string,
			},
			google: {
				prompt: "select_account",
				clientId: env.GOOGLE_CLIENT_ID as string,
				clientSecret: env.GOOGLE_CLIENT_SECRET as string,
			},
		},
		plugins: [
			polar({
				client: polarClient,
				createCustomerOnSignUp: true,
				use: [
					checkout({
						products: [
							{
								productId: env.POLAR_PRO_M_PRODUCT_ID as string,
								slug: env.POLAR_PRO_M_SLUG as string,
							},
							{
								productId: env.POLAR_PRO_Y_PRODUCT_ID as string,
								slug: env.POLAR_PRO_Y_SLUG as string,
							},
						],
						successUrl: `${env.CORS_ORIGIN}/success?checkout_id={CHECKOUT_ID}`,
						authenticatedUsersOnly: true,
					}),
					portal(),
					webhooks({
						secret: env.POLAR_WEBHOOK_SECRET || "",
						// ...polarWebhookHandlers,
					}),
				],
			}),
			admin(),
			openAPI(),
		],
	});

	return authInstance;
}

export function getAuth() {
	if (!authInstance) {
		throw new Error("Auth not initialized. Call initializeAuth() first.");
	}
	return authInstance;
}
