import type {
	algorithms,
	languages,
	results,
	snippets,
} from "@type-ninja/db/schema";
import type {
	AlgorithmDto,
	LanguageDto,
	ResultDto,
	SnippetDto,
} from "@type-ninja/shared/api";

type AlgorithmRow = typeof algorithms.$inferSelect;
type LanguageRow = typeof languages.$inferSelect;
type SnippetRow = typeof snippets.$inferSelect;
type ResultRow = typeof results.$inferSelect;

export function toLanguageDto(row: LanguageRow): LanguageDto {
	return {
		id: row.id,
		name: row.name,
		extension: row.extension,
		indent: row.indent,
	};
}

export function toAlgorithmDto(
	row: AlgorithmRow,
	languageIds: string[]
): AlgorithmDto {
	return {
		slug: row.slug,
		name: row.name,
		category: row.category,
		difficulty: row.difficulty,
		summary: row.summary,
		tags: row.tags,
		complexity: {
			timeBest: row.timeBest,
			timeAverage: row.timeAverage,
			timeWorst: row.timeWorst,
			space: row.space,
		},
		languages: languageIds,
	};
}

export function toSnippetDto(
	row: SnippetRow,
	algorithm: AlgorithmDto,
	language: LanguageDto
): SnippetDto {
	return {
		id: row.id,
		algorithm,
		language,
		code: row.code,
		charCount: row.charCount,
		lineCount: row.lineCount,
	};
}

export function toResultDto(row: ResultRow, algorithmName: string): ResultDto {
	return {
		id: row.id,
		snippetId: row.snippetId,
		algorithmSlug: row.algorithmSlug,
		algorithmName,
		language: row.languageId,
		difficulty: row.difficulty,
		wpm: row.wpm,
		raw: row.raw,
		accuracy: row.accuracy,
		consistency: row.consistency,
		durationMs: row.durationMs,
		chars: row.chars,
		chart: row.chart,
		stopOnError: row.stopOnError,
		autoIndent: row.autoIndent,
		blindMode: row.blindMode,
		isPersonalBest: row.isPersonalBest,
		createdAt: row.createdAt.toISOString(),
	};
}
