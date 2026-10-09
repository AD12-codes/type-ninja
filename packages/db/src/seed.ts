import { createHash } from "node:crypto";
import { LANGUAGES } from "@type-ninja/algorithms";
import { loadContent } from "@type-ninja/algorithms/loader";
import { logger } from "@type-ninja/core/logger";
import { sql } from "drizzle-orm";
import { getDB } from "./drizzle";
import { algorithms, languages, snippets } from "./schema";

const TRAILING_NEWLINES = /\n+$/;

function hash(value: string): string {
	return createHash("sha256").update(value).digest("hex");
}

/**
 * Idempotently upserts languages, algorithms (with explanations) and snippets
 * from the `@type-ninja/algorithms` content package. Safe to run on every boot.
 */
export async function seedContent() {
	const db = getDB();
	const content = await loadContent();
	const explanationBySlug = new Map(
		content.explanations.map((e) => [e.slug, e.markdown] as const)
	);

	await db
		.insert(languages)
		.values(
			LANGUAGES.map((language, index) => ({
				id: language.id,
				name: language.name,
				extension: language.extension,
				indent: language.indent,
				sortOrder: index,
			}))
		)
		.onConflictDoUpdate({
			target: languages.id,
			set: {
				name: sql`excluded.name`,
				extension: sql`excluded.extension`,
				indent: sql`excluded.indent`,
				sortOrder: sql`excluded.sort_order`,
			},
		});

	await db
		.insert(algorithms)
		.values(
			content.algorithms.map((algorithm) => ({
				slug: algorithm.slug,
				name: algorithm.name,
				category: algorithm.category,
				difficulty: algorithm.difficulty,
				summary: algorithm.summary,
				tags: algorithm.tags,
				timeBest: algorithm.complexity.timeBest,
				timeAverage: algorithm.complexity.timeAverage,
				timeWorst: algorithm.complexity.timeWorst,
				space: algorithm.complexity.space,
				explanation: explanationBySlug.get(algorithm.slug) ?? "",
				updatedAt: new Date(),
			}))
		)
		.onConflictDoUpdate({
			target: algorithms.slug,
			set: {
				name: sql`excluded.name`,
				category: sql`excluded.category`,
				difficulty: sql`excluded.difficulty`,
				summary: sql`excluded.summary`,
				tags: sql`excluded.tags`,
				timeBest: sql`excluded.time_best`,
				timeAverage: sql`excluded.time_average`,
				timeWorst: sql`excluded.time_worst`,
				space: sql`excluded.space`,
				explanation: sql`excluded.explanation`,
				updatedAt: sql`excluded.updated_at`,
			},
		});

	if (content.snippets.length > 0) {
		await db
			.insert(snippets)
			.values(
				content.snippets.map((snippet) => {
					const code = snippet.code.replace(TRAILING_NEWLINES, "");
					return {
						algorithmSlug: snippet.slug,
						languageId: snippet.language,
						code,
						charCount: code.length,
						lineCount: code.split("\n").length,
						contentHash: hash(code),
						updatedAt: new Date(),
					};
				})
			)
			.onConflictDoUpdate({
				target: [snippets.algorithmSlug, snippets.languageId],
				set: {
					code: sql`excluded.code`,
					charCount: sql`excluded.char_count`,
					lineCount: sql`excluded.line_count`,
					contentHash: sql`excluded.content_hash`,
					updatedAt: sql`excluded.updated_at`,
				},
				setWhere: sql`${snippets.contentHash} <> excluded.content_hash`,
			});
	}

	logger.info(
		{
			languages: LANGUAGES.length,
			algorithms: content.algorithms.length,
			snippets: content.snippets.length,
			explanations: content.explanations.length,
		},
		"content seeded"
	);
}
