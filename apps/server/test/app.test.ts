import { describe, expect, test } from "bun:test";

/**
 * Route-level tests run against a real Postgres database when TEST_DATABASE_URL
 * (or DATABASE_URL) is set, and are skipped otherwise so `bun test` stays green
 * on machines without a database.
 */
const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const describeWithDb = databaseUrl ? describe : describe.skip;

describeWithDb("api routes", () => {
	process.env.DATABASE_URL = databaseUrl;
	process.env.BETTER_AUTH_SECRET ??= "test-secret-test-secret-test-secret-1234";
	process.env.BETTER_AUTH_URL ??= "http://localhost:9797";
	process.env.SEED_ON_START = "false";

	test("serves languages, algorithms, a random snippet and the leaderboard", async () => {
		const { initializeDB } = await import("@type-ninja/db");
		const { seedContent } = await import("@type-ninja/db/seed");
		const { runMigrations } = await import("@type-ninja/db/migrate");
		const { initializeAuth } = await import("@type-ninja/auth");
		const { app } = await import("../src/app");

		await initializeDB();
		await runMigrations();
		await seedContent();
		initializeAuth();

		const languages = await app.request("/api/v1/languages");
		expect(languages.status).toBe(200);
		const languagesBody = (await languages.json()) as {
			languages: { id: string }[];
		};
		expect(languagesBody.languages.some((l) => l.id === "python")).toBe(true);

		const algorithms = await app.request("/api/v1/algorithms");
		const algorithmsBody = (await algorithms.json()) as {
			algorithms: { slug: string }[];
		};
		expect(algorithmsBody.algorithms.length).toBeGreaterThan(20);

		const snippet = await app.request(
			"/api/v1/snippets/random?language=go&category=sorting"
		);
		expect(snippet.status).toBe(200);
		const snippetBody = (await snippet.json()) as {
			snippet: {
				language: { id: string };
				algorithm: { category: string };
				code: string;
			};
		};
		expect(snippetBody.snippet.language.id).toBe("go");
		expect(snippetBody.snippet.algorithm.category).toBe("sorting");
		expect(snippetBody.snippet.code.length).toBeGreaterThan(20);

		const explanation = await app.request("/api/v1/algorithms/bubble-sort");
		const explanationBody = (await explanation.json()) as {
			explanation: { markdown: string };
		};
		expect(explanationBody.explanation.markdown).toContain("```mermaid");

		const leaderboard = await app.request(
			"/api/v1/leaderboards?language=python"
		);
		expect(leaderboard.status).toBe(200);

		const unauthorized = await app.request("/api/v1/results", {
			method: "POST",
			body: JSON.stringify({}),
			headers: { "Content-Type": "application/json" },
		});
		expect(unauthorized.status).toBe(401);

		const missing = await app.request("/api/v1/nope");
		expect(missing.status).toBe(404);
	});
});
