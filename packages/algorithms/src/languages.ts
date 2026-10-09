/**
 * Programming languages supported by typeninja.
 *
 * `indent` is the canonical indentation unit used by every snippet in that
 * language. Snippets never contain tab characters.
 */
export const LANGUAGES = [
	{ id: "python", name: "Python", extension: "py", indent: 4 },
	{ id: "javascript", name: "JavaScript", extension: "js", indent: 2 },
	{ id: "typescript", name: "TypeScript", extension: "ts", indent: 2 },
	{ id: "go", name: "Go", extension: "go", indent: 4 },
	{ id: "rust", name: "Rust", extension: "rs", indent: 4 },
	{ id: "java", name: "Java", extension: "java", indent: 4 },
	{ id: "csharp", name: "C#", extension: "cs", indent: 4 },
	{ id: "cpp", name: "C++", extension: "cpp", indent: 4 },
	{ id: "c", name: "C", extension: "c", indent: 4 },
	{ id: "lua", name: "Lua", extension: "lua", indent: 4 },
	{ id: "ruby", name: "Ruby", extension: "rb", indent: 2 },
	{ id: "kotlin", name: "Kotlin", extension: "kt", indent: 4 },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_IDS = LANGUAGES.map((l) => l.id) as LanguageId[];

export const DEFAULT_LANGUAGE: LanguageId = "python";

export function getLanguage(id: string): Language | undefined {
	return LANGUAGES.find((l) => l.id === id);
}

export function isLanguageId(id: string): id is LanguageId {
	return LANGUAGES.some((l) => l.id === id);
}
