import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { ALGORITHMS } from "../src/catalog";
import { LANGUAGES } from "../src/languages";
import { explanationPath, loadContent, snippetPath } from "../src/loader";
import {
	REQUIRED_EXPLANATION_HEADINGS,
	snippetProblems,
} from "../src/validate";

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("catalog", () => {
	test("slugs are unique and kebab-case", () => {
		const slugs = ALGORITHMS.map((a) => a.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		for (const slug of slugs) {
			expect(slug).toMatch(KEBAB_CASE);
		}
	});

	test("language ids are unique", () => {
		const ids = LANGUAGES.map((l) => l.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe("snippets", () => {
	for (const language of LANGUAGES) {
		for (const algorithm of ALGORITHMS) {
			test(`${language.id}/${algorithm.slug}`, async () => {
				const path = snippetPath(language.id, algorithm.slug);
				const code = await readFile(path, "utf8");
				const problems = snippetProblems(code, language.indent);
				expect(problems, `${path}:\n  ${problems.join("\n  ")}`).toEqual([]);
			});
		}
	}
});

describe("explanations", () => {
	for (const algorithm of ALGORITHMS) {
		test(algorithm.slug, async () => {
			const markdown = await readFile(explanationPath(algorithm.slug), "utf8");
			expect(markdown.startsWith(`# ${algorithm.name}`)).toBe(true);
			for (const heading of REQUIRED_EXPLANATION_HEADINGS) {
				expect(markdown, `missing ${heading}`).toContain(`\n${heading}\n`);
			}
			expect(markdown).toContain("```mermaid\n");
			expect(markdown).not.toContain("\t");
			expect(markdown.endsWith("\n")).toBe(true);
		});
	}
});

describe("loader", () => {
	test("loads every snippet and explanation", async () => {
		const content = await loadContent();
		expect(content.snippets.length).toBe(ALGORITHMS.length * LANGUAGES.length);
		expect(content.explanations.length).toBe(ALGORITHMS.length);
	});
});
