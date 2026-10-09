import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	real,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth";

export const languages = pgTable("languages", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	extension: text("extension").notNull(),
	indent: integer("indent").notNull(),
	sortOrder: integer("sort_order").notNull().default(0),
	enabled: boolean("enabled").notNull().default(true),
});

export const algorithms = pgTable("algorithms", {
	slug: text("slug").primaryKey(),
	name: text("name").notNull(),
	category: text("category").notNull(),
	difficulty: text("difficulty").notNull(),
	summary: text("summary").notNull(),
	tags: jsonb("tags").$type<string[]>().notNull().default([]),
	timeBest: text("time_best").notNull(),
	timeAverage: text("time_average").notNull(),
	timeWorst: text("time_worst").notNull(),
	space: text("space").notNull(),
	/** Language-agnostic explanation in markdown with a mermaid flow diagram. */
	explanation: text("explanation").notNull().default(""),
	enabled: boolean("enabled").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const snippets = pgTable(
	"snippets",
	{
		id: serial("id").primaryKey(),
		algorithmSlug: text("algorithm_slug")
			.notNull()
			.references(() => algorithms.slug, { onDelete: "cascade" }),
		languageId: text("language_id")
			.notNull()
			.references(() => languages.id, { onDelete: "cascade" }),
		code: text("code").notNull(),
		charCount: integer("char_count").notNull(),
		lineCount: integer("line_count").notNull(),
		contentHash: text("content_hash").notNull(),
		enabled: boolean("enabled").notNull().default(true),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("snippets_algorithm_language_idx").on(
			table.algorithmSlug,
			table.languageId
		),
		index("snippets_language_idx").on(table.languageId),
	]
);

export interface ResultChars {
	correct: number;
	incorrect: number;
	extra: number;
	missed: number;
	newlines: number;
	skipped: number;
}

export interface ResultChartPoint {
	second: number;
	wpm: number;
	raw: number;
	errors: number;
}

export const results = pgTable(
	"results",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		snippetId: integer("snippet_id")
			.notNull()
			.references(() => snippets.id, { onDelete: "cascade" }),
		algorithmSlug: text("algorithm_slug").notNull(),
		languageId: text("language_id").notNull(),
		difficulty: text("difficulty").notNull(),
		wpm: real("wpm").notNull(),
		raw: real("raw").notNull(),
		accuracy: real("accuracy").notNull(),
		consistency: real("consistency").notNull(),
		durationMs: integer("duration_ms").notNull(),
		chars: jsonb("chars").$type<ResultChars>().notNull(),
		keypressesCorrect: integer("keypresses_correct").notNull(),
		keypressesIncorrect: integer("keypresses_incorrect").notNull(),
		chart: jsonb("chart").$type<ResultChartPoint[]>().notNull(),
		stopOnError: text("stop_on_error").notNull(),
		autoIndent: boolean("auto_indent").notNull(),
		blindMode: boolean("blind_mode").notNull(),
		isPersonalBest: boolean("is_personal_best").notNull().default(false),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		index("results_user_created_idx").on(table.userId, table.createdAt),
		index("results_language_created_idx").on(table.languageId, table.createdAt),
	]
);

/** Best run per user per language per algorithm. */
export const personalBests = pgTable(
	"personal_bests",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		languageId: text("language_id").notNull(),
		algorithmSlug: text("algorithm_slug").notNull(),
		resultId: uuid("result_id")
			.notNull()
			.references(() => results.id, { onDelete: "cascade" }),
		wpm: real("wpm").notNull(),
		raw: real("raw").notNull(),
		accuracy: real("accuracy").notNull(),
		consistency: real("consistency").notNull(),
		difficulty: text("difficulty").notNull(),
		achievedAt: timestamp("achieved_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.languageId, table.algorithmSlug],
		}),
	]
);

/** Best run per user per language; this is what the leaderboard reads. */
export const languageBests = pgTable(
	"language_bests",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		languageId: text("language_id").notNull(),
		resultId: uuid("result_id")
			.notNull()
			.references(() => results.id, { onDelete: "cascade" }),
		algorithmSlug: text("algorithm_slug").notNull(),
		wpm: real("wpm").notNull(),
		raw: real("raw").notNull(),
		accuracy: real("accuracy").notNull(),
		consistency: real("consistency").notNull(),
		achievedAt: timestamp("achieved_at").defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.languageId] }),
		index("language_bests_leaderboard_idx").on(table.languageId, table.wpm),
	]
);

export const userStats = pgTable("user_stats", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	testsCompleted: integer("tests_completed").notNull().default(0),
	testsStarted: integer("tests_started").notNull().default(0),
	timeTypingMs: integer("time_typing_ms").notNull().default(0),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userConfigs = pgTable("user_configs", {
	userId: text("user_id")
		.primaryKey()
		.references(() => users.id, { onDelete: "cascade" }),
	config: jsonb("config").$type<Record<string, unknown>>().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const algorithmsRelations = relations(algorithms, ({ many }) => ({
	snippets: many(snippets),
}));

export const snippetsRelations = relations(snippets, ({ one }) => ({
	algorithm: one(algorithms, {
		fields: [snippets.algorithmSlug],
		references: [algorithms.slug],
	}),
	language: one(languages, {
		fields: [snippets.languageId],
		references: [languages.id],
	}),
}));

export const resultsRelations = relations(results, ({ one }) => ({
	user: one(users, { fields: [results.userId], references: [users.id] }),
	snippet: one(snippets, {
		fields: [results.snippetId],
		references: [snippets.id],
	}),
}));
