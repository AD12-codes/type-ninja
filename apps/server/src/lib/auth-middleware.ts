import { getAuth, type Session } from "@type-ninja/auth";
import { createMiddleware } from "hono/factory";
import { unauthorized } from "./errors";

export interface AuthVariables {
	user: Session["user"] | null;
	session: Session["session"] | null;
}

/** Resolves the session for every request without requiring it. */
export const sessionMiddleware = createMiddleware<{ Variables: AuthVariables }>(
	async (c, next) => {
		const session = await getAuth().api.getSession({
			headers: c.req.raw.headers,
		});
		c.set("user", session?.user ?? null);
		c.set("session", session?.session ?? null);
		await next();
	}
);

/** Rejects the request when no user is signed in. */
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
	async (c, next) => {
		if (!c.get("user")) {
			throw unauthorized();
		}
		await next();
	}
);

export function requireUser(c: {
	get: (key: "user") => Session["user"] | null;
}) {
	const user = c.get("user");
	if (!user) {
		throw unauthorized();
	}
	return user;
}
