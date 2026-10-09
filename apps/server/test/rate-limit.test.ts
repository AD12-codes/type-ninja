import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { RateLimiter, rateLimit } from "../src/lib/rate-limit";

describe("RateLimiter", () => {
	test("allows up to max hits per window and resets afterwards", () => {
		const limiter = new RateLimiter(1000, 2);
		expect(limiter.hit("a", 0).allowed).toBe(true);
		expect(limiter.hit("a", 10).allowed).toBe(true);
		const third = limiter.hit("a", 20);
		expect(third.allowed).toBe(false);
		expect(third.remaining).toBe(0);
		expect(limiter.hit("b", 20).allowed).toBe(true);
		expect(limiter.hit("a", 1001).allowed).toBe(true);
	});
});

describe("rateLimit middleware", () => {
	test("returns 429 with Retry-After once the limit is exceeded", async () => {
		const app = new Hono();
		app.use("*", rateLimit({ name: "t", windowMs: 60_000, max: 2 }));
		app.get("/", (c) => c.text("ok"));
		const headers = { "x-forwarded-for": "203.0.113.5" };

		const first = await app.request("/", { headers });
		expect(first.status).toBe(200);
		expect(first.headers.get("RateLimit-Remaining")).toBe("1");
		await app.request("/", { headers });
		const third = await app.request("/", { headers });
		expect(third.status).toBe(429);
		expect(Number(third.headers.get("Retry-After"))).toBeGreaterThan(0);
		const body = (await third.json()) as { error: { code: string } };
		expect(body.error.code).toBe("RATE_LIMITED");

		const other = await app.request("/", {
			headers: { "x-forwarded-for": "203.0.113.6" },
		});
		expect(other.status).toBe(200);
	});
});
