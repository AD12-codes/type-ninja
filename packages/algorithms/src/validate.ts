/** Validation rules for snippet files; see CONTENT.md. */
export const MAX_LINE_LENGTH = 64;
export const MIN_LINES = 5;
export const MAX_LINES = 45;

const NON_ASCII = /[^\x20-\x7e\n]/;
const TRAILING_WHITESPACE = /[ \t]+$/;
const FINAL_NEWLINE = /\n$/;

export const REQUIRED_EXPLANATION_HEADINGS = [
	"## Overview",
	"## How it works",
	"## Flow",
	"## Complexity",
	"## When to use",
	"## Pitfalls",
];

export function snippetProblems(code: string, indent: number): string[] {
	const problems: string[] = [];
	if (code.includes("\r")) {
		problems.push("contains CRLF line endings");
	}
	if (code.includes("\t")) {
		problems.push("contains tab characters");
	}
	if (!code.endsWith("\n") || code.endsWith("\n\n")) {
		problems.push("must end with exactly one newline");
	}
	if (NON_ASCII.test(code)) {
		problems.push("contains non-ASCII characters");
	}
	const lines = code.replace(FINAL_NEWLINE, "").split("\n");
	if (lines.length < MIN_LINES || lines.length > MAX_LINES) {
		problems.push(
			`has ${lines.length} lines (expected ${MIN_LINES}-${MAX_LINES})`
		);
	}
	if (lines[0]?.trim() === "") {
		problems.push("starts with a blank line");
	}
	lines.forEach((line, index) => {
		const n = index + 1;
		if (line.length > MAX_LINE_LENGTH) {
			problems.push(`line ${n} longer than ${MAX_LINE_LENGTH} chars`);
		}
		if (TRAILING_WHITESPACE.test(line)) {
			problems.push(`line ${n} has trailing whitespace`);
		}
		const leading = line.length - line.trimStart().length;
		if (line.trim() !== "" && leading % indent !== 0) {
			problems.push(`line ${n} indentation is not a multiple of ${indent}`);
		}
		if (line.trim() === "" && index > 0 && lines[index - 1]?.trim() === "") {
			problems.push(`line ${n} is a second consecutive blank line`);
		}
	});
	return problems;
}
