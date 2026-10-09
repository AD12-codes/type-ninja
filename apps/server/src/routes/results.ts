import { getDB } from "@type-ninja/db";
import {
	algorithms,
	languageBests,
	personalBests,
	results,
	userStats,
} from "@type-ninja/db/schema";
import {
	type PaginatedResults,
	ResultsQuerySchema,
	type SubmitResultResponse,
	SubmitResultSchema,
} from "@type-ninja/shared/api";
import { and, desc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import {
	type AuthVariables,
	requireAuth,
	requireUser,
} from "../lib/auth-middleware";
import { toResultDto } from "../lib/dto";
import { notFound } from "../lib/errors";
import { saveResult } from "../lib/results-service";
import { parseOrThrow } from "../lib/validate";

const resultsRoute = new Hono<{ Variables: AuthVariables }>();

resultsRoute.use("*", requireAuth);

resultsRoute.post("/", async (c) => {
	const user = requireUser(c);
	const body = parseOrThrow(SubmitResultSchema, await c.req.json());
	const db = getDB();
	const outcome = await saveResult(db, user.id, body);
	const [row] = await db
		.select()
		.from(results)
		.where(eq(results.id, outcome.resultId));
	if (!row) {
		throw notFound("Result not found");
	}
	const response: SubmitResultResponse = {
		result: toResultDto(row, outcome.algorithmName),
		isPersonalBest: outcome.isPersonalBest,
		isLanguageBest: outcome.isLanguageBest,
		leaderboardRank: outcome.leaderboardRank,
	};
	return c.json(response, 201);
});

resultsRoute.get("/", async (c) => {
	const user = requireUser(c);
	const query = parseOrThrow(ResultsQuerySchema, c.req.query());
	const db = getDB();
	const conditions = [eq(results.userId, user.id)];
	if (query.language) {
		conditions.push(eq(results.languageId, query.language));
	}
	if (query.algorithm) {
		conditions.push(eq(results.algorithmSlug, query.algorithm));
	}
	const where = and(...conditions);
	const [rows, [count]] = await Promise.all([
		db
			.select({ result: results, algorithmName: algorithms.name })
			.from(results)
			.innerJoin(algorithms, eq(results.algorithmSlug, algorithms.slug))
			.where(where)
			.orderBy(desc(results.createdAt))
			.limit(query.pageSize)
			.offset(query.page * query.pageSize),
		db.select({ count: sql<number>`count(*)::int` }).from(results).where(where),
	]);
	const response: PaginatedResults = {
		results: rows.map((r) => toResultDto(r.result, r.algorithmName)),
		total: count?.count ?? 0,
		page: query.page,
		pageSize: query.pageSize,
	};
	return c.json(response);
});

resultsRoute.get("/:id", async (c) => {
	const user = requireUser(c);
	const db = getDB();
	const [row] = await db
		.select({ result: results, algorithmName: algorithms.name })
		.from(results)
		.innerJoin(algorithms, eq(results.algorithmSlug, algorithms.slug))
		.where(and(eq(results.id, c.req.param("id")), eq(results.userId, user.id)));
	if (!row) {
		throw notFound("Result not found");
	}
	return c.json({ result: toResultDto(row.result, row.algorithmName) });
});

/** Resets the account: deletes every result, personal best and stat. */
resultsRoute.delete("/", async (c) => {
	const user = requireUser(c);
	const db = getDB();
	await db.transaction(async (tx) => {
		await tx.delete(languageBests).where(eq(languageBests.userId, user.id));
		await tx.delete(personalBests).where(eq(personalBests.userId, user.id));
		await tx.delete(results).where(eq(results.userId, user.id));
		await tx.delete(userStats).where(eq(userStats.userId, user.id));
	});
	return c.json({ ok: true });
});

export default resultsRoute;
