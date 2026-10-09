import { getDB } from "@type-ninja/db";
import {
	algorithms,
	languageBests,
	results,
	users,
} from "@type-ninja/db/schema";
import {
	type LeaderboardEntryDto,
	LeaderboardQuerySchema,
	type LeaderboardResponse,
	MIN_LEADERBOARD_ACCURACY,
} from "@type-ninja/shared/api";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AuthVariables } from "../lib/auth-middleware";
import { parseOrThrow } from "../lib/validate";

const leaderboards = new Hono<{ Variables: AuthVariables }>();

const DAILY_WINDOW = sql`now() - interval '1 day'`;

function entry(
	rank: number,
	row: {
		userId: string;
		username: string | null;
		name: string;
		image: string | null;
		wpm: number;
		raw: number;
		accuracy: number;
		consistency: number;
		algorithmSlug: string;
		algorithmName: string;
		achievedAt: Date;
	}
): LeaderboardEntryDto {
	return {
		rank,
		userId: row.userId,
		username: row.username ?? row.name,
		image: row.image,
		wpm: row.wpm,
		raw: row.raw,
		accuracy: row.accuracy,
		consistency: row.consistency,
		algorithmSlug: row.algorithmSlug,
		algorithmName: row.algorithmName,
		achievedAt: row.achievedAt.toISOString(),
	};
}

leaderboards.get("/", async (c) => {
	const query = parseOrThrow(LeaderboardQuerySchema, c.req.query());
	const db = getDB();
	const me = c.get("user");

	if (query.period === "daily") {
		// Best result per user in the last 24 hours.
		const ranked = db.$with("ranked").as(
			db
				.select({
					userId: results.userId,
					wpm: results.wpm,
					raw: results.raw,
					accuracy: results.accuracy,
					consistency: results.consistency,
					algorithmSlug: results.algorithmSlug,
					achievedAt: results.createdAt,
					rn: sql<number>`row_number() over (partition by ${results.userId} order by ${results.wpm} desc)`.as(
						"rn"
					),
				})
				.from(results)
				.where(
					and(
						eq(results.languageId, query.language),
						gte(results.createdAt, DAILY_WINDOW),
						gte(results.accuracy, MIN_LEADERBOARD_ACCURACY),
						eq(results.blindMode, false),
						...(query.algorithm
							? [eq(results.algorithmSlug, query.algorithm)]
							: [])
					)
				)
		);
		const rows = await db
			.with(ranked)
			.select({
				userId: ranked.userId,
				username: users.username,
				name: users.name,
				image: users.image,
				wpm: ranked.wpm,
				raw: ranked.raw,
				accuracy: ranked.accuracy,
				consistency: ranked.consistency,
				algorithmSlug: ranked.algorithmSlug,
				algorithmName: algorithms.name,
				achievedAt: ranked.achievedAt,
			})
			.from(ranked)
			.innerJoin(users, eq(ranked.userId, users.id))
			.innerJoin(algorithms, eq(ranked.algorithmSlug, algorithms.slug))
			.where(eq(ranked.rn, 1))
			.orderBy(desc(ranked.wpm), desc(ranked.accuracy));
		const entries = rows.map((row, index) => entry(index + 1, row));
		const page = entries.slice(
			query.page * query.pageSize,
			(query.page + 1) * query.pageSize
		);
		const response: LeaderboardResponse = {
			language: query.language,
			period: "daily",
			entries: page,
			total: entries.length,
			page: query.page,
			pageSize: query.pageSize,
			me: me ? (entries.find((e) => e.userId === me.id) ?? null) : null,
		};
		return c.json(response);
	}

	const where = and(
		eq(languageBests.languageId, query.language),
		...(query.algorithm
			? [eq(languageBests.algorithmSlug, query.algorithm)]
			: [])
	);
	const [rows, [count]] = await Promise.all([
		db
			.select({
				userId: languageBests.userId,
				username: users.username,
				name: users.name,
				image: users.image,
				wpm: languageBests.wpm,
				raw: languageBests.raw,
				accuracy: languageBests.accuracy,
				consistency: languageBests.consistency,
				algorithmSlug: languageBests.algorithmSlug,
				algorithmName: algorithms.name,
				achievedAt: languageBests.achievedAt,
			})
			.from(languageBests)
			.innerJoin(users, eq(languageBests.userId, users.id))
			.innerJoin(algorithms, eq(languageBests.algorithmSlug, algorithms.slug))
			.where(where)
			.orderBy(desc(languageBests.wpm), desc(languageBests.accuracy))
			.limit(query.pageSize)
			.offset(query.page * query.pageSize),
		db
			.select({ count: sql<number>`count(*)::int` })
			.from(languageBests)
			.where(where),
	]);
	const entries = rows.map((row, index) =>
		entry(query.page * query.pageSize + index + 1, row)
	);

	let mine: LeaderboardEntryDto | null = null;
	if (me) {
		const [own] = await db
			.select({
				userId: languageBests.userId,
				username: users.username,
				name: users.name,
				image: users.image,
				wpm: languageBests.wpm,
				raw: languageBests.raw,
				accuracy: languageBests.accuracy,
				consistency: languageBests.consistency,
				algorithmSlug: languageBests.algorithmSlug,
				algorithmName: algorithms.name,
				achievedAt: languageBests.achievedAt,
			})
			.from(languageBests)
			.innerJoin(users, eq(languageBests.userId, users.id))
			.innerJoin(algorithms, eq(languageBests.algorithmSlug, algorithms.slug))
			.where(and(where, eq(languageBests.userId, me.id)));
		if (own) {
			const [ahead] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(languageBests)
				.where(and(where, sql`${languageBests.wpm} > ${own.wpm}`));
			mine = entry((ahead?.count ?? 0) + 1, own);
		}
	}

	const response: LeaderboardResponse = {
		language: query.language,
		period: "all-time",
		entries,
		total: count?.count ?? 0,
		page: query.page,
		pageSize: query.pageSize,
		me: mine,
	};
	return c.json(response);
});

export default leaderboards;
