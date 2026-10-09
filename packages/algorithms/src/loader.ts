import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ALGORITHMS, type AlgorithmMeta } from "./catalog";
import { LANGUAGES, type LanguageId } from "./languages";

const CONTENT_DIR = join(import.meta.dirname, "..", "content");

export interface LoadedSnippet {
	slug: string;
	language: LanguageId;
	code: string;
}

export interface LoadedExplanation {
	slug: string;
	markdown: string;
}

export interface LoadedContent {
	algorithms: AlgorithmMeta[];
	snippets: LoadedSnippet[];
	explanations: LoadedExplanation[];
}

export function snippetPath(language: LanguageId, slug: string): string {
	const lang = LANGUAGES.find((l) => l.id === language);
	if (!lang) {
		throw new Error(`Unknown language: ${language}`);
	}
	return join(CONTENT_DIR, "snippets", language, `${slug}.${lang.extension}`);
}

export function explanationPath(slug: string): string {
	return join(CONTENT_DIR, "explanations", `${slug}.md`);
}

async function readOptional(path: string): Promise<string | null> {
	try {
		return await readFile(path, "utf8");
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return null;
		}
		throw error;
	}
}

/**
 * Loads every snippet and explanation from disk. Missing files are skipped so
 * the catalog can grow incrementally; the test-suite enforces completeness.
 */
export async function loadContent(): Promise<LoadedContent> {
	const snippets: LoadedSnippet[] = [];
	const explanations: LoadedExplanation[] = [];

	for (const algorithm of ALGORITHMS) {
		const markdown = await readOptional(explanationPath(algorithm.slug));
		if (markdown !== null) {
			explanations.push({ slug: algorithm.slug, markdown });
		}
		for (const language of LANGUAGES) {
			const code = await readOptional(snippetPath(language.id, algorithm.slug));
			if (code !== null) {
				snippets.push({ slug: algorithm.slug, language: language.id, code });
			}
		}
	}

	return { algorithms: ALGORITHMS, snippets, explanations };
}
