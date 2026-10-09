import type { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { createMiddleware } from "hono/factory";
import type { AuthVariables } from "./auth-middleware";

/**
 * Fixed-window rate limiter kept in process memory. The app runs as a single
 * container, so a shared store is not needed; limits reset on restart.
 */

export interface RateLimitOptions {
	/** Window length in milliseconds. */
	windowMs: number;
	/** Maximum requests per key per window. */
	max: number;
	/** Identifies the client. Defaults to the client IP. */
	keyFor?: (c: Context<{ Variables: AuthVariables }>) => string;
	/** Short name used in the response headers and logs. */
	name: string;
}

interface Bucket {
	count: number;
	resetAt: number;
}

const MS_PER_SECOND = 1000;
const SWEEP_INTERVAL_MS = 60_000;

export class RateLimiter {
	private readonly buckets = new Map<string, Bucket>();
	private lastSweep = 0;

	constructor(
		private readonly windowMs: number,
		private readonly max: number
	) {}

	/** Records a hit and reports whether the key is still within its limit. */
	hit(
		key: string,
		now = Date.now()
	): { allowed: boolean; remaining: number; resetAt: number } {
		this.sweep(now);
		const existing = this.buckets.get(key);
		const bucket =
			existing && existing.resetAt > now
				? existing
				: { count: 0, resetAt: now + this.windowMs };
		bucket.count += 1;
		this.buckets.set(key, bucket);
		return {
			allowed: bucket.count <= this.max,
			remaining: Math.max(0, this.max - bucket.count),
			resetAt: bucket.resetAt,
		};
	}

	reset(key?: string) {
		if (key === undefined) {
			this.buckets.clear();
		} else {
			this.buckets.delete(key);
		}
	}

	private sweep(now: number) {
		if (now - this.lastSweep < SWEEP_INTERVAL_MS) {
			return;
		}
		this.lastSweep = now;
		for (const [key, bucket] of this.buckets) {
			if (bucket.resetAt <= now) {
				this.buckets.delete(key);
			}
		}
	}
}

const trustProxy = process.env.TRUST_PROXY !== "false";

/** Client IP, honouring the reverse proxy header when `TRUST_PROXY` is not "false". */
export function clientIp(c: Context): string {
	if (trustProxy) {
		const forwarded = c.req.header("x-forwarded-for");
		const first = forwarded?.split(",")[0]?.trim();
		if (first) {
			return first;
		}
		const real = c.req.header("x-real-ip");
		if (real) {
			return real;
		}
	}
	try {
		return getConnInfo(c).remote.address ?? "unknown";
	} catch {
		return "unknown";
	}
}

export function rateLimit(options: RateLimitOptions) {
	const limiter = new RateLimiter(options.windowMs, options.max);
	const keyFor: NonNullable<RateLimitOptions["keyFor"]> =
		options.keyFor ?? ((c) => clientIp(c));

	const middleware = createMiddleware<{ Variables: AuthVariables }>(
		async (c, next) => {
			const now = Date.now();
			const result = limiter.hit(`${options.name}:${keyFor(c)}`, now);
			const resetSeconds = Math.max(
				1,
				Math.ceil((result.resetAt - now) / MS_PER_SECOND)
			);
			c.header("RateLimit-Limit", String(options.max));
			c.header("RateLimit-Remaining", String(result.remaining));
			c.header("RateLimit-Reset", String(resetSeconds));
			if (!result.allowed) {
				c.header("Retry-After", String(resetSeconds));
				return c.json(
					{
						error: {
							code: "RATE_LIMITED",
							message: `Too many requests, try again in ${resetSeconds}s`,
						},
					},
					429
				);
			}
			await next();
		}
	);

	return Object.assign(middleware, { limiter });
}

const MINUTE = 60_000;

/** Generic safety net for the whole API, per IP. */
export const apiLimiter = rateLimit({
	name: "api",
	windowMs: MINUTE,
	max: 600,
});

/** Sign-in, sign-up, password and account changes, per IP. */
export const authLimiter = rateLimit({
	name: "auth",
	windowMs: 15 * MINUTE,
	max: 30,
});

/** Result submissions, per user when signed in, otherwise per IP. */
export const resultsLimiter = rateLimit({
	name: "results",
	windowMs: MINUTE,
	max: 30,
	keyFor: (c) => c.get("user")?.id ?? clientIp(c),
});
