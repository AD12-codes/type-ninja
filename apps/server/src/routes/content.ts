import { getDB } from "@type-ninja/db";
import { algorithms, languages, snippets } from "@type-ninja/db/schema";
import { RandomSnippetQuerySchema } from "@type-ninja/shared/api";
import { and, asc, eq, ne, sql } from "drizzle-orm";
import { Hono } from "hono";
import { toAlgorithmDto, toLanguageDto, toSnippetDto } from "../lib/dto";
import { badRequest, notFound } from "../lib/errors";
import { parseOrThrow } from "../lib/validate";

const content = new Hono();

content.get("/languages", async (c) => {
	const db = getDB();
	const rows = await db
		.select()
		.from(languages)
		.where(eq(languages.enabled, true))
		.orderBy(asc(languages.sortOrder));
	return c.json({ languages: rows.map(toLanguageDto) });
});

async function languagesPerAlgorithm(): Promise<Map<string, string[]>> {
	const db = getDB();
	const rows = await db
		.select({ slug: snippets.algorithmSlug, language: snippets.languageId })
		.from(snippets)
		.where(eq(snippets.enabled, true));
	const map = new Map<string, string[]>();
	for (const row of rows) {
		const list = map.get(row.slug) ?? [];
		list.push(row.language);
		map.set(row.slug, list);
	}
	return map;
}

content.get("/algorithms", async (c) => {
	const db = getDB();
	const [rows, available] = await Promise.all([
		db
			.select()
			.from(algorithms)
			.where(eq(algorithms.enabled, true))
			.orderBy(asc(algorithms.category), asc(algorithms.name)),
		languagesPerAlgorithm(),
	]);
	return c.json({
		algorithms: rows.map((row) =>
			toAlgorithmDto(row, available.get(row.slug) ?? [])
		),
	});
});

content.get("/algorithms/:slug", async (c) => {
	const db = getDB();
	const slug = c.req.param("slug");
	const [row] = await db
		.select()
		.from(algorithms)
		.where(eq(algorithms.slug, slug));
	if (!row?.enabled) {
		throw notFound("Algorithm not found");
	}
	const available = await languagesPerAlgorithm();
	return c.json({
		algorithm: toAlgorithmDto(row, available.get(slug) ?? []),
		explanation: { slug: row.slug, name: row.name, markdown: row.explanation },
	});
});

content.get("/snippets/random", async (c) => {
	const query = parseOrThrow(RandomSnippetQuerySchema, c.req.query());
	const db = getDB();

	const conditions = [
		eq(snippets.enabled, true),
		eq(snippets.languageId, query.language),
	];
	if (query.algorithm !== "random") {
		conditions.push(eq(snippets.algorithmSlug, query.algorithm));
	} else if (query.category !== "all") {
		conditions.push(eq(algorithms.category, query.category));
	}
	if (query.exclude !== undefined && query.algorithm === "random") {
		conditions.push(ne(snippets.id, query.exclude));
	}

	const [row] = await db
		.select({ snippet: snippets, algorithm: algorithms, language: languages })
		.from(snippets)
		.innerJoin(algorithms, eq(snippets.algorithmSlug, algorithms.slug))
		.innerJoin(languages, eq(snippets.languageId, languages.id))
		.where(and(...conditions, eq(algorithms.enabled, true)))
		.orderBy(sql`random()`)
		.limit(1);

	if (!row) {
		throw badRequest(
			"No snippet matches the selected language, category and algorithm"
		);
	}
	return c.json({
		snippet: toSnippetDto(
			row.snippet,
			toAlgorithmDto(row.algorithm, []),
			toLanguageDto(row.language)
		),
	});
});

content.get("/snippets/:id", async (c) => {
	const id = Number(c.req.param("id"));
	if (!Number.isInteger(id)) {
		throw badRequest("Invalid snippet id");
	}
	const db = getDB();
	const [row] = await db
		.select({ snippet: snippets, algorithm: algorithms, language: languages })
		.from(snippets)
		.innerJoin(algorithms, eq(snippets.algorithmSlug, algorithms.slug))
		.innerJoin(languages, eq(snippets.languageId, languages.id))
		.where(eq(snippets.id, id));
	if (!row) {
		throw notFound("Snippet not found");
	}
	return c.json({
		snippet: toSnippetDto(
			row.snippet,
			toAlgorithmDto(row.algorithm, []),
			toLanguageDto(row.language)
		),
	});
});

export default content;
