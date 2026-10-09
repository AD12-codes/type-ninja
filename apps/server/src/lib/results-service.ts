import type { Database } from "@type-ninja/db";
import {
	algorithms,
	languageBests,
	personalBests,
	results,
	snippets,
	userStats,
} from "@type-ninja/db/schema";
import {
	MIN_LEADERBOARD_ACCURACY,
	type SubmitResult,
} from "@type-ninja/shared/api";
import { roundTo, wpmFromChars } from "@type-ninja/typing-engine";
import { and, eq, gt, sql } from "drizzle-orm";
import { badRequest, notFound } from "./errors";

/** Tolerance when re-deriving speed and accuracy from the submitted counts. */
const WPM_TOLERANCE = 1.5;
const ACCURACY_TOLERANCE = 1;
const PERCENT = 100;

export function validateResultMath(
	body: SubmitResult,
	snippetCharCount: number
) {
	const scoredCorrect = body.chars.correct + body.chars.newlines;
	const expectedWpm = wpmFromChars(scoredCorrect, body.durationMs);
	if (Math.abs(expectedWpm - body.wpm) > WPM_TOLERANCE) {
		throw badRequest("Reported wpm does not match the typed characters");
	}
	const scoredRaw = scoredCorrect + body.chars.incorrect + body.chars.extra;
	const expectedRaw = wpmFromChars(scoredRaw, body.durationMs);
	if (Math.abs(expectedRaw - body.raw) > WPM_TOLERANCE) {
		throw badRequest("Reported raw wpm does not match the typed characters");
	}
	const keypresses = body.keypresses.correct + body.keypresses.incorrect;
	const expectedAccuracy =
		keypresses === 0
			? PERCENT
			: (body.keypresses.correct / keypresses) * PERCENT;
	if (Math.abs(expectedAccuracy - body.accuracy) > ACCURACY_TOLERANCE) {
		throw badRequest("Reported accuracy does not match the keypresses");
	}
	const typedTotal =
		body.chars.correct +
		body.chars.incorrect +
		body.chars.missed +
		body.chars.skipped +
		body.chars.newlines;
	if (typedTotal > snippetCharCount) {
		throw badRequest("Reported characters exceed the snippet length");
	}
	if (
		body.chars.correct + body.chars.skipped + body.chars.newlines <
		snippetCharCount * 0.5
	) {
		throw badRequest("Too few correct characters for a completed test");
	}
}

export interface SaveResultOutcome {
	resultId: string;
	isPersonalBest: boolean;
	isLanguageBest: boolean;
	leaderboardRank: number | null;
	algorithmName: string;
}

export async function saveResult(
	db: Database,
	userId: string,
	body: SubmitResult
): Promise<SaveResultOutcome> {
	const [snippet] = await db
		.select({ snippet: snippets, algorithmName: algorithms.name })
		.from(snippets)
		.innerJoin(algorithms, eq(snippets.algorithmSlug, algorithms.slug))
		.where(eq(snippets.id, body.snippetId));
	if (!snippet) {
		throw notFound("Snippet not found");
	}

	validateResultMath(body, snippet.snippet.charCount);

	return await db.transaction(async (tx) => {
		const { algorithmSlug, languageId } = snippet.snippet;

		const [existingPb] = await tx
			.select()
			.from(personalBests)
			.where(
				and(
					eq(personalBests.userId, userId),
					eq(personalBests.languageId, languageId),
					eq(personalBests.algorithmSlug, algorithmSlug)
				)
			);
		const isPersonalBest = !existingPb || body.wpm > existingPb.wpm;

		const [inserted] = await tx
			.insert(results)
			.values({
				userId,
				snippetId: body.snippetId,
				algorithmSlug,
				languageId,
				difficulty: body.difficulty,
				wpm: roundTo(body.wpm, 2),
				raw: roundTo(body.raw, 2),
				accuracy: roundTo(body.accuracy, 2),
				consistency: roundTo(body.consistency, 2),
				durationMs: body.durationMs,
				chars: body.chars,
				keypressesCorrect: body.keypresses.correct,
				keypressesIncorrect: body.keypresses.incorrect,
				chart: body.chart,
				stopOnError: body.stopOnError,
				autoIndent: body.autoIndent,
				blindMode: body.blindMode,
				isPersonalBest,
			})
			.returning({ id: results.id });
		if (!inserted) {
			throw new Error("Failed to insert result");
		}

		if (isPersonalBest) {
			await tx
				.insert(personalBests)
				.values({
					userId,
					languageId,
					algorithmSlug,
					resultId: inserted.id,
					wpm: body.wpm,
					raw: body.raw,
					accuracy: body.accuracy,
					consistency: body.consistency,
					difficulty: body.difficulty,
				})
				.onConflictDoUpdate({
					target: [
						personalBests.userId,
						personalBests.languageId,
						personalBests.algorithmSlug,
					],
					set: {
						resultId: inserted.id,
						wpm: body.wpm,
						raw: body.raw,
						accuracy: body.accuracy,
						consistency: body.consistency,
						difficulty: body.difficulty,
						achievedAt: new Date(),
					},
				});
		}

		let isLanguageBest = false;
		let leaderboardRank: number | null = null;
		const eligible =
			body.accuracy >= MIN_LEADERBOARD_ACCURACY && !body.blindMode;
		if (eligible) {
			const [existingBest] = await tx
				.select()
				.from(languageBests)
				.where(
					and(
						eq(languageBests.userId, userId),
						eq(languageBests.languageId, languageId)
					)
				);
			isLanguageBest = !existingBest || body.wpm > existingBest.wpm;
			if (isLanguageBest) {
				await tx
					.insert(languageBests)
					.values({
						userId,
						languageId,
						resultId: inserted.id,
						algorithmSlug,
						wpm: body.wpm,
						raw: body.raw,
						accuracy: body.accuracy,
						consistency: body.consistency,
					})
					.onConflictDoUpdate({
						target: [languageBests.userId, languageBests.languageId],
						set: {
							resultId: inserted.id,
							algorithmSlug,
							wpm: body.wpm,
							raw: body.raw,
							accuracy: body.accuracy,
							consistency: body.consistency,
							achievedAt: new Date(),
						},
					});
			}
			const bestWpm = isLanguageBest
				? body.wpm
				: (existingBest?.wpm ?? body.wpm);
			const [ahead] = await tx
				.select({ count: sql<number>`count(*)::int` })
				.from(languageBests)
				.where(
					and(
						eq(languageBests.languageId, languageId),
						gt(languageBests.wpm, bestWpm)
					)
				);
			leaderboardRank = (ahead?.count ?? 0) + 1;
		}

		await tx
			.insert(userStats)
			.values({
				userId,
				testsCompleted: 1,
				testsStarted: 1 + body.restartCount,
				timeTypingMs: body.durationMs,
			})
			.onConflictDoUpdate({
				target: userStats.userId,
				set: {
					testsCompleted: sql`${userStats.testsCompleted} + 1`,
					testsStarted: sql`${userStats.testsStarted} + ${1 + body.restartCount}`,
					timeTypingMs: sql`${userStats.timeTypingMs} + ${body.durationMs}`,
					updatedAt: new Date(),
				},
			});

		return {
			resultId: inserted.id,
			isPersonalBest,
			isLanguageBest,
			leaderboardRank,
			algorithmName: snippet.algorithmName,
		};
	});
}
