import { DIFFICULTIES, LANGUAGE_IDS } from "@type-ninja/algorithms";
import { z } from "zod";

/** Hard sanity caps used by the server to reject impossible results. */
export const MAX_WPM = 400;
export const MAX_RESULT_CHART_POINTS = 3600;
export const MIN_RESULT_DURATION_MS = 1000;
export const MIN_LEADERBOARD_ACCURACY = 80;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;
export const PASSWORD_MIN = 8;

export const CharCountsSchema = z.object({
	correct: z.number().int().nonnegative(),
	incorrect: z.number().int().nonnegative(),
	extra: z.number().int().nonnegative(),
	missed: z.number().int().nonnegative(),
	newlines: z.number().int().nonnegative(),
	skipped: z.number().int().nonnegative(),
});

export const ChartPointSchema = z.object({
	second: z.number().int().positive(),
	wpm: z.number().nonnegative(),
	raw: z.number().nonnegative(),
	errors: z.number().int().nonnegative(),
});

export const SubmitResultSchema = z.object({
	snippetId: z.number().int().positive(),
	difficulty: z.enum(
		DIFFICULTIES.length ? ["normal", "expert", "master"] : ["normal"]
	),
	wpm: z.number().nonnegative().max(MAX_WPM),
	raw: z
		.number()
		.nonnegative()
		.max(MAX_WPM * 2),
	accuracy: z.number().min(0).max(100),
	consistency: z.number().min(0).max(100),
	durationMs: z.number().int().min(MIN_RESULT_DURATION_MS),
	chars: CharCountsSchema,
	keypresses: z.object({
		correct: z.number().int().nonnegative(),
		incorrect: z.number().int().nonnegative(),
	}),
	chart: z.array(ChartPointSchema).max(MAX_RESULT_CHART_POINTS),
	stopOnError: z.enum(["off", "letter", "line"]),
	autoIndent: z.boolean(),
	blindMode: z.boolean(),
	/** Tests restarted before this one completed; feeds the "tests started" stat. */
	restartCount: z.number().int().nonnegative().default(0),
});

export type SubmitResult = z.infer<typeof SubmitResultSchema>;

export const UpdateProfileSchema = z.object({
	username: z
		.string()
		.min(USERNAME_MIN)
		.max(USERNAME_MAX)
		.regex(
			USERNAME_REGEX,
			"Only letters, numbers, dots, dashes and underscores"
		)
		.optional(),
	bio: z.string().max(250).optional(),
	keyboard: z.string().max(100).optional(),
});

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const LeaderboardQuerySchema = z.object({
	language: z.enum(LANGUAGE_IDS as [string, ...string[]]).default("python"),
	period: z.enum(["all-time", "daily"]).default("all-time"),
	algorithm: z.string().optional(),
	page: z.coerce.number().int().min(0).default(0),
	pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>;

export const ResultsQuerySchema = z.object({
	page: z.coerce.number().int().min(0).default(0),
	pageSize: z.coerce.number().int().min(1).max(100).default(25),
	language: z.string().optional(),
	algorithm: z.string().optional(),
});

export const RandomSnippetQuerySchema = z.object({
	language: z.enum(LANGUAGE_IDS as [string, ...string[]]).default("python"),
	category: z.string().default("all"),
	algorithm: z.string().default("random"),
	/** Exclude a snippet id so "next test" never repeats the previous one. */
	exclude: z.coerce.number().int().optional(),
});

// ── Response types (shared with the web client) ─────────────────────────────

export interface LanguageDto {
	id: string;
	name: string;
	extension: string;
	indent: number;
}

export interface AlgorithmDto {
	slug: string;
	name: string;
	category: string;
	difficulty: string;
	summary: string;
	tags: string[];
	complexity: {
		timeBest: string;
		timeAverage: string;
		timeWorst: string;
		space: string;
	};
	/** Languages that have a snippet for this algorithm. */
	languages: string[];
}

export interface SnippetDto {
	id: number;
	algorithm: AlgorithmDto;
	language: LanguageDto;
	code: string;
	charCount: number;
	lineCount: number;
}

export interface ExplanationDto {
	slug: string;
	name: string;
	markdown: string;
}

export interface ResultDto {
	id: string;
	snippetId: number;
	algorithmSlug: string;
	algorithmName: string;
	language: string;
	difficulty: string;
	wpm: number;
	raw: number;
	accuracy: number;
	consistency: number;
	durationMs: number;
	chars: z.infer<typeof CharCountsSchema>;
	chart: z.infer<typeof ChartPointSchema>[];
	stopOnError: string;
	autoIndent: boolean;
	blindMode: boolean;
	isPersonalBest: boolean;
	createdAt: string;
}

export interface SubmitResultResponse {
	result: ResultDto;
	isPersonalBest: boolean;
	/** True if this run became the user's best for the language overall. */
	isLanguageBest: boolean;
	leaderboardRank: number | null;
}

export interface PersonalBestDto {
	language: string;
	algorithmSlug: string;
	algorithmName: string;
	wpm: number;
	raw: number;
	accuracy: number;
	consistency: number;
	difficulty: string;
	achievedAt: string;
}

export interface LanguageBestDto {
	language: string;
	wpm: number;
	raw: number;
	accuracy: number;
	consistency: number;
	algorithmSlug: string;
	algorithmName: string;
	achievedAt: string;
}

export interface UserStatsDto {
	testsCompleted: number;
	testsStarted: number;
	timeTypingMs: number;
	averageWpm: number;
	averageAccuracy: number;
	highestWpm: number;
	last10AverageWpm: number;
	last10AverageAccuracy: number;
}

export interface ProfileDto {
	id: string;
	username: string;
	name: string;
	image: string | null;
	bio: string | null;
	keyboard: string | null;
	joinedAt: string;
	stats: UserStatsDto;
	languageBests: LanguageBestDto[];
	personalBests: PersonalBestDto[];
	/** Best leaderboard rank per language, if any. */
	ranks: { language: string; rank: number }[];
}

export interface LeaderboardEntryDto {
	rank: number;
	userId: string;
	username: string;
	image: string | null;
	wpm: number;
	raw: number;
	accuracy: number;
	consistency: number;
	algorithmSlug: string;
	algorithmName: string;
	achievedAt: string;
}

export interface LeaderboardResponse {
	language: string;
	period: "all-time" | "daily";
	entries: LeaderboardEntryDto[];
	total: number;
	page: number;
	pageSize: number;
	/** The requesting user's own entry, when signed in and ranked. */
	me: LeaderboardEntryDto | null;
}

export interface PaginatedResults {
	results: ResultDto[];
	total: number;
	page: number;
	pageSize: number;
}

export interface ActivityDay {
	date: string;
	tests: number;
}

export interface ApiError {
	error: { code: string; message: string; details?: unknown };
}
