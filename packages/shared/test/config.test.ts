import { describe, expect, test } from "bun:test";
import { SubmitResultSchema } from "../src/api";
import { DEFAULT_CONFIG, parseConfig } from "../src/config";

describe("parseConfig", () => {
	test("returns defaults for garbage", () => {
		expect(parseConfig(null)).toEqual(DEFAULT_CONFIG);
		expect(parseConfig("nope")).toEqual(DEFAULT_CONFIG);
	});

	test("keeps valid keys and repairs invalid ones", () => {
		const parsed = parseConfig({
			language: "rust",
			theme: "dracula",
			fontSize: "huge",
			caretStyle: "blob",
		});
		expect(parsed.language).toBe("rust");
		expect(parsed.theme).toBe("dracula");
		expect(parsed.fontSize).toBe(DEFAULT_CONFIG.fontSize);
		expect(parsed.caretStyle).toBe(DEFAULT_CONFIG.caretStyle);
	});
});

describe("SubmitResultSchema", () => {
	test("rejects impossible speeds", () => {
		const result = SubmitResultSchema.safeParse({
			snippetId: 1,
			difficulty: "normal",
			wpm: 900,
			raw: 900,
			accuracy: 100,
			consistency: 100,
			durationMs: 5000,
			chars: {
				correct: 1,
				incorrect: 0,
				extra: 0,
				missed: 0,
				newlines: 0,
				skipped: 0,
			},
			keypresses: { correct: 1, incorrect: 0 },
			chart: [],
			stopOnError: "off",
			autoIndent: true,
			blindMode: false,
		});
		expect(result.success).toBe(false);
	});
});
