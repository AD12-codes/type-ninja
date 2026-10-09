import { describe, expect, test } from "bun:test";
import type { SubmitResult } from "@type-ninja/shared/api";
import { validateResultMath } from "../src/lib/results-service";

const SNIPPET_CHARS = 140;

function result(overrides: Partial<SubmitResult> = {}): SubmitResult {
	// 100 correct chars + 10 newlines = 110 scored chars in 30s -> 44 wpm.
	return {
		snippetId: 1,
		difficulty: "normal",
		wpm: 44,
		raw: 48,
		accuracy: 95,
		consistency: 80,
		durationMs: 30_000,
		chars: {
			correct: 100,
			incorrect: 5,
			extra: 5,
			missed: 0,
			newlines: 10,
			skipped: 20,
		},
		keypresses: { correct: 114, incorrect: 6 },
		chart: [],
		stopOnError: "off",
		autoIndent: true,
		blindMode: false,
		restartCount: 0,
		...overrides,
	};
}

describe("validateResultMath", () => {
	test("accepts a consistent result", () => {
		expect(() => validateResultMath(result(), SNIPPET_CHARS)).not.toThrow();
	});

	test("rejects wpm that does not match the character counts", () => {
		expect(() =>
			validateResultMath(result({ wpm: 120 }), SNIPPET_CHARS)
		).toThrow("wpm does not match");
	});

	test("rejects raw wpm that does not match the character counts", () => {
		expect(() =>
			validateResultMath(result({ raw: 10 }), SNIPPET_CHARS)
		).toThrow("raw wpm does not match");
	});

	test("rejects accuracy that does not match the keypresses", () => {
		expect(() =>
			validateResultMath(result({ accuracy: 60 }), SNIPPET_CHARS)
		).toThrow("accuracy does not match");
	});

	test("rejects more characters than the snippet contains", () => {
		expect(() => validateResultMath(result(), 50)).toThrow(
			"exceed the snippet length"
		);
	});

	test("rejects runs with too few correct characters", () => {
		const body = result({
			wpm: 2,
			raw: 6,
			chars: {
				correct: 5,
				incorrect: 5,
				extra: 5,
				missed: 0,
				newlines: 0,
				skipped: 0,
			},
		});
		expect(() => validateResultMath(body, SNIPPET_CHARS)).toThrow(
			"Too few correct"
		);
	});
});
