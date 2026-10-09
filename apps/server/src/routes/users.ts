import { getDB } from "@type-ninja/db";
import {
	algorithms,
	languageBests,
	personalBests,
	results,
	userConfigs,
	userStats,
	users,
} from "@type-ninja/db/schema";
import {
	type ActivityDay,
	type LanguageBestDto,
	type PersonalBestDto,
	type ProfileDto,
	UpdateProfileSchema,
	type UserStatsDto,
} from "@type-ninja/shared/api";
import { parseConfig } from "@type-ninja/shared/config";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { Hono } from "hono";
import {
	type AuthVariables,
	requireAuth,
	requireUser,
} from "../lib/auth-middleware";
import { conflict, notFound } from "../lib/errors";
import { parseOrThrow } from "../lib/validate";

const usersRoute = new Hono<{ Variables: AuthVariables }>();

type UserRow = typeof users.$inferSelect;

const LAST_N = 10;
const ACTIVITY_DAYS = 365;

async function buildStats(userId: string): Promise<UserStatsDto> {
	const db = getDB();
	const [[stats], [aggregate], last] = await Promise.all([
		db.select().from(userStats).where(eq(userStats.userId, userId)),
		db
			.select({
				averageWpm: sql<number>`coalesce(avg(${results.wpm}), 0)::float`,
				averageAccuracy: sql<number>`coalesce(avg(${results.accuracy}), 0)::float`,
				highestWpm: sql<number>`coalesce(max(${results.wpm}), 0)::float`,
			})
			.from(results)
			.where(eq(results.userId, userId)),
		db
			.select({ wpm: results.wpm, accuracy: results.accuracy })
			.from(results)
			.where(eq(results.userId, userId))
			.orderBy(desc(results.createdAt))
			.limit(LAST_N),
	]);
	const avg = (values: number[]) =>
		values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
	return {
		testsCompleted: stats?.testsCompleted ?? 0,
		testsStarted: stats?.testsStarted ?? 0,
		timeTypingMs: stats?.timeTypingMs ?? 0,
		averageWpm: aggregate?.averageWpm ?? 0,
		averageAccuracy: aggregate?.averageAccuracy ?? 0,
		highestWpm: aggregate?.highestWpm ?? 0,
		last10AverageWpm: avg(last.map((r) => r.wpm)),
		last10AverageAccuracy: avg(last.map((r) => r.accuracy)),
	};
}

async function buildProfile(user: UserRow): Promise<ProfileDto> {
	const db = getDB();
	const [stats, bests, pbs] = await Promise.all([
		buildStats(user.id),
		db
			.select({ best: languageBests, algorithmName: algorithms.name })
			.from(languageBests)
			.innerJoin(algorithms, eq(languageBests.algorithmSlug, algorithms.slug))
			.where(eq(languageBests.userId, user.id))
			.orderBy(desc(languageBests.wpm)),
		db
			.select({ pb: personalBests, algorithmName: algorithms.name })
			.from(personalBests)
			.innerJoin(algorithms, eq(personalBests.algorithmSlug, algorithms.slug))
			.where(eq(personalBests.userId, user.id))
			.orderBy(desc(personalBests.wpm)),
	]);

	const ranks = await Promise.all(
		bests.map(async ({ best }) => {
			const [ahead] = await db
				.select({ count: sql<number>`count(*)::int` })
				.from(languageBests)
				.where(
					and(
						eq(languageBests.languageId, best.languageId),
						gt(languageBests.wpm, best.wpm)
					)
				);
			return { language: best.languageId, rank: (ahead?.count ?? 0) + 1 };
		})
	);

	const languageBestDtos: LanguageBestDto[] = bests.map(
		({ best, algorithmName }) => ({
			language: best.languageId,
			wpm: best.wpm,
			raw: best.raw,
			accuracy: best.accuracy,
			consistency: best.consistency,
			algorithmSlug: best.algorithmSlug,
			algorithmName,
			achievedAt: best.achievedAt.toISOString(),
		})
	);

	const personalBestDtos: PersonalBestDto[] = pbs.map(
		({ pb, algorithmName }) => ({
			language: pb.languageId,
			algorithmSlug: pb.algorithmSlug,
			algorithmName,
			wpm: pb.wpm,
			raw: pb.raw,
			accuracy: pb.accuracy,
			consistency: pb.consistency,
			difficulty: pb.difficulty,
			achievedAt: pb.achievedAt.toISOString(),
		})
	);

	return {
		id: user.id,
		username: user.username ?? user.name,
		name: user.name,
		image: user.image,
		bio: user.bio,
		keyboard: user.keyboard,
		joinedAt: user.createdAt.toISOString(),
		stats,
		languageBests: languageBestDtos,
		personalBests: personalBestDtos,
		ranks,
	};
}

async function activity(userId: string): Promise<ActivityDay[]> {
	const db = getDB();
	const rows = await db
		.select({
			date: sql<string>`to_char(${results.createdAt}, 'YYYY-MM-DD')`,
			tests: sql<number>`count(*)::int`,
		})
		.from(results)
		.where(
			and(
				eq(results.userId, userId),
				gt(
					results.createdAt,
					sql`now() - interval '${sql.raw(String(ACTIVITY_DAYS))} days'`
				)
			)
		)
		.groupBy(sql`to_char(${results.createdAt}, 'YYYY-MM-DD')`);
	return rows;
}

usersRoute.get("/me", requireAuth, async (c) => {
	const sessionUser = requireUser(c);
	const db = getDB();
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, sessionUser.id));
	if (!user) {
		throw notFound("User not found");
	}
	return c.json({ profile: await buildProfile(user) });
});

usersRoute.get("/me/activity", requireAuth, async (c) => {
	const user = requireUser(c);
	return c.json({ activity: await activity(user.id) });
});

usersRoute.patch("/me", requireAuth, async (c) => {
	const sessionUser = requireUser(c);
	const body = parseOrThrow(UpdateProfileSchema, await c.req.json());
	const db = getDB();
	if (body.username) {
		const [taken] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, body.username.toLowerCase()));
		if (taken && taken.id !== sessionUser.id) {
			throw conflict("That username is already taken");
		}
	}
	const [user] = await db
		.update(users)
		.set({
			...(body.username
				? {
						username: body.username.toLowerCase(),
						displayUsername: body.username,
						name: body.username,
					}
				: {}),
			...(body.bio !== undefined ? { bio: body.bio } : {}),
			...(body.keyboard !== undefined ? { keyboard: body.keyboard } : {}),
		})
		.where(eq(users.id, sessionUser.id))
		.returning();
	if (!user) {
		throw notFound("User not found");
	}
	return c.json({ profile: await buildProfile(user) });
});

usersRoute.get("/me/config", requireAuth, async (c) => {
	const user = requireUser(c);
	const db = getDB();
	const [row] = await db
		.select()
		.from(userConfigs)
		.where(eq(userConfigs.userId, user.id));
	return c.json({
		config: row ? parseConfig(row.config) : null,
		updatedAt: row?.updatedAt.toISOString() ?? null,
	});
});

usersRoute.put("/me/config", requireAuth, async (c) => {
	const user = requireUser(c);
	const config = parseConfig(await c.req.json());
	const db = getDB();
	await db
		.insert(userConfigs)
		.values({ userId: user.id, config })
		.onConflictDoUpdate({
			target: userConfigs.userId,
			set: { config, updatedAt: new Date() },
		});
	return c.json({ config });
});

usersRoute.delete("/me/personal-bests", requireAuth, async (c) => {
	const user = requireUser(c);
	const db = getDB();
	await db.transaction(async (tx) => {
		await tx.delete(personalBests).where(eq(personalBests.userId, user.id));
		await tx.delete(languageBests).where(eq(languageBests.userId, user.id));
		await tx
			.update(results)
			.set({ isPersonalBest: false })
			.where(eq(results.userId, user.id));
	});
	return c.json({ ok: true });
});

usersRoute.get("/:username", async (c) => {
	const db = getDB();
	const username = c.req.param("username").toLowerCase();
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.username, username));
	if (!user) {
		throw notFound("User not found");
	}
	return c.json({ profile: await buildProfile(user) });
});

export default usersRoute;
