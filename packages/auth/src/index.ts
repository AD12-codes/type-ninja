import { getDB } from "@type-ninja/db/drizzle";
import {
	accounts,
	sessions,
	users,
	verifications,
} from "@type-ninja/db/schema/auth";
import { env } from "@type-ninja/env/server";
import {
	PASSWORD_MIN,
	USERNAME_MAX,
	USERNAME_MIN,
	USERNAME_REGEX,
} from "@type-ninja/shared/api";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { sendMail } from "./mailer";

let authInstance: ReturnType<typeof createAuth> | null = null;

const SESSION_DAYS = 30;
const SECONDS_PER_DAY = 60 * 60 * 24;
const RESERVED_USERNAMES = new Set([
	"admin",
	"administrator",
	"typeninja",
	"root",
	"system",
	"support",
	"me",
]);

export function isUsernameValid(value: string): boolean {
	return (
		value.length >= USERNAME_MIN &&
		value.length <= USERNAME_MAX &&
		USERNAME_REGEX.test(value) &&
		!RESERVED_USERNAMES.has(value.toLowerCase())
	);
}

function socialProviders(): BetterAuthOptions["socialProviders"] {
	const providers: NonNullable<BetterAuthOptions["socialProviders"]> = {};
	if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
		providers.github = {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		};
	}
	if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
		providers.google = {
			prompt: "select_account",
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		};
	}
	return providers;
}

/** Social providers that are configured, exposed to the web client. */
export function enabledSocialProviders(): string[] {
	return Object.keys(socialProviders() ?? {});
}

function createAuth() {
	const db = getDB();
	const trustedOrigins = [env.BETTER_AUTH_URL, env.CORS_ORIGIN].filter(
		(origin): origin is string => Boolean(origin)
	);
	const sameOrigin = !env.CORS_ORIGIN;

	return betterAuth({
		appName: "typeninja",
		baseURL: env.BETTER_AUTH_URL,
		secret: env.BETTER_AUTH_SECRET,
		database: drizzleAdapter(db, {
			provider: "pg",
			schema: { users, sessions, accounts, verifications },
		}),
		user: {
			modelName: "users",
			additionalFields: {
				bio: { type: "string", required: false, input: false },
				keyboard: { type: "string", required: false, input: false },
			},
			changeEmail: { enabled: true },
			deleteUser: { enabled: true },
		},
		session: {
			modelName: "sessions",
			expiresIn: SESSION_DAYS * SECONDS_PER_DAY,
			updateAge: SECONDS_PER_DAY,
			cookieCache: { enabled: true, maxAge: 5 * 60 },
		},
		account: { modelName: "accounts" },
		verification: { modelName: "verifications" },
		emailAndPassword: {
			enabled: true,
			minPasswordLength: PASSWORD_MIN,
			requireEmailVerification: false,
			sendResetPassword: async ({ user, url }) => {
				await sendMail({
					to: user.email,
					subject: "typeninja: reset your password",
					text: `Hi ${user.name},\n\nReset your typeninja password using this link:\n${url}\n\nIf you did not request this, you can ignore this email.`,
				});
			},
		},
		trustedOrigins,
		advanced: {
			defaultCookieAttributes: sameOrigin
				? {
						sameSite: "lax",
						secure: env.NODE_ENV === "production",
						httpOnly: true,
					}
				: { sameSite: "none", secure: true, httpOnly: true },
		},
		socialProviders: socialProviders(),
		plugins: [
			username({
				minUsernameLength: USERNAME_MIN,
				maxUsernameLength: USERNAME_MAX,
				usernameValidator: isUsernameValid,
			}),
		],
	});
}

export function initializeAuth() {
	if (!authInstance) {
		authInstance = createAuth();
	}
	return authInstance;
}

export function getAuth() {
	if (!authInstance) {
		throw new Error("Auth not initialized. Call initializeAuth() first.");
	}
	return authInstance;
}

export type Auth = ReturnType<typeof initializeAuth>;
export type Session = Auth["$Infer"]["Session"];
