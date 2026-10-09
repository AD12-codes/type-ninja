import { describe, expect, test } from "bun:test";
import {
	applyKey,
	caretPosition,
	charStates,
	computeStats,
	createTest,
	type KeyEvent,
	kogasa,
	progress,
	type TestState,
	wpmFromChars,
} from "../src";

const SNIPPET = "def add(a, b):\n    return a + b\n";

/** Types a string character by character, using Enter for newlines. */
function typeText(
	state: TestState,
	text: string,
	startTime = 0,
	msPerKey = 100
): TestState {
	let next = state;
	let time = startTime;
	for (const char of text) {
		const event: KeyEvent =
			char === "\n" ? { type: "enter", time } : { type: "char", char, time };
		next = applyKey(next, event);
		time += msPerKey;
	}
	return next;
}

describe("createTest", () => {
	test("splits into lines and pre-fills indentation when autoIndent is on", () => {
		const state = createTest(SNIPPET);
		expect(state.lines.length).toBe(2);
		expect(state.lines[1]?.typed).toBe("    ");
		expect(state.lines[1]?.skipped).toBe(4);
		expect(state.status).toBe("idle");
	});

	test("does not pre-fill indentation when autoIndent is off", () => {
		const state = createTest(SNIPPET, { autoIndent: false });
		expect(state.lines[1]?.typed).toBe("");
		expect(state.lines[1]?.skipped).toBe(0);
	});

	test("normalizes CRLF and tabs", () => {
		const state = createTest("a\r\n\tb\r\n");
		expect(state.lines.map((l) => l.expected)).toEqual(["a", "    b"]);
	});
});

describe("applyKey", () => {
	test("finishes when the whole snippet is typed correctly", () => {
		const state = typeText(createTest(SNIPPET), "def add(a, b):\nreturn a + b");
		expect(state.status).toBe("finished");
		expect(state.keypresses.incorrect).toBe(0);
		expect(state.keypresses.correct).toBe(
			"def add(a, b):\nreturn a + b".length
		);
	});

	test("starts the timer on the first keypress", () => {
		const state = applyKey(createTest(SNIPPET), {
			type: "char",
			char: "d",
			time: 500,
		});
		expect(state.startedAt).toBe(500);
		expect(state.status).toBe("running");
		expect(state.keyLog[0]?.t).toBe(0);
	});

	test("marks incorrect characters but keeps advancing by default", () => {
		const state = typeText(createTest(SNIPPET), "dxf");
		expect(charStates(state.lines[0] as never).slice(0, 3)).toEqual([
			"correct",
			"incorrect",
			"correct",
		]);
		expect(state.keypresses.incorrect).toBe(1);
	});

	test("stopOnError=letter refuses incorrect characters", () => {
		const state = typeText(
			createTest(SNIPPET, { stopOnError: "letter" }),
			"dx"
		);
		expect(state.lines[0]?.typed).toBe("d");
		expect(state.keypresses.incorrect).toBe(1);
	});

	test("stopOnError=line refuses Enter on an incorrect line", () => {
		const state = typeText(
			createTest(SNIPPET, { stopOnError: "line" }),
			"def add(a, b);\n"
		);
		expect(state.lineIndex).toBe(0);
	});

	test("ignores Enter when nothing has been typed on a non-blank line", () => {
		const state = applyKey(createTest(SNIPPET), { type: "enter", time: 0 });
		expect(state.lineIndex).toBe(0);
		expect(state.status).toBe("idle");
	});

	test("allows Enter on blank lines", () => {
		const state = typeText(createTest("a\n\nb"), "a\n\n");
		expect(state.lineIndex).toBe(2);
	});

	test("expert difficulty fails on an incorrect line", () => {
		const state = typeText(
			createTest(SNIPPET, { difficulty: "expert" }),
			"def add(a, b);\n"
		);
		expect(state.status).toBe("failed");
	});

	test("master difficulty fails on any incorrect key", () => {
		const state = typeText(createTest(SNIPPET, { difficulty: "master" }), "x");
		expect(state.status).toBe("failed");
	});

	test("backspace removes characters but not auto-indented ones", () => {
		let state = typeText(createTest(SNIPPET), "def add(a, b):\nre");
		state = applyKey(state, { type: "backspace", word: false, time: 2000 });
		state = applyKey(state, { type: "backspace", word: false, time: 2100 });
		state = applyKey(state, { type: "backspace", word: false, time: 2200 });
		expect(state.lines[1]?.typed).toBe("    ");
		expect(state.lineIndex).toBe(1);
	});

	test("backspace returns to a previous line only if it had errors", () => {
		let state = typeText(createTest(SNIPPET), "def add(a, b);\n");
		state = applyKey(state, { type: "backspace", word: false, time: 2000 });
		expect(state.lineIndex).toBe(0);
		expect(state.lines[0]?.submitted).toBe(false);
	});

	test("freedom mode allows returning to a correct line", () => {
		let state = typeText(
			createTest(SNIPPET, { freedomMode: true }),
			"def add(a, b):\n"
		);
		state = applyKey(state, { type: "backspace", word: false, time: 2000 });
		expect(state.lineIndex).toBe(0);
	});

	test("word backspace deletes the previous word", () => {
		let state = typeText(createTest(SNIPPET), "def add");
		state = applyKey(state, { type: "backspace", word: true, time: 900 });
		expect(state.lines[0]?.typed).toBe("def ");
	});

	test("confidence mode max disables backspace", () => {
		let state = typeText(createTest(SNIPPET, { confidenceMode: "max" }), "dx");
		state = applyKey(state, { type: "backspace", word: false, time: 900 });
		expect(state.lines[0]?.typed).toBe("dx");
	});

	test("tab types indentation when autoIndent is off", () => {
		let state = typeText(
			createTest(SNIPPET, { autoIndent: false }),
			"def add(a, b):\n"
		);
		state = applyKey(state, { type: "tab", time: 2000 });
		expect(state.lines[1]?.typed).toBe("    ");
		expect(state.keypresses.correct).toBe("def add(a, b):\n".length + 4);
	});

	test("ignores input once finished", () => {
		const finished = typeText(createTest("ab"), "ab");
		const after = applyKey(finished, { type: "char", char: "c", time: 999 });
		expect(after).toBe(finished);
	});

	test("caps extra characters per line", () => {
		const state = typeText(createTest("ab\ncd"), "ab".padEnd(40, "x"));
		expect(state.lines[0]?.typed.length).toBe(22);
	});

	test("tracks caret and progress", () => {
		const state = typeText(createTest(SNIPPET), "def add(a, b):\nret");
		expect(caretPosition(state)).toEqual({ line: 1, col: 7 });
		expect(progress(state)).toBeGreaterThan(0.5);
		expect(progress(state)).toBeLessThan(1);
	});
});

describe("computeStats", () => {
	test("computes wpm from correct characters including newlines", () => {
		// 27 keystrokes at 100ms each: last key at 2600ms.
		const state = typeText(createTest(SNIPPET), "def add(a, b):\nreturn a + b");
		const stats = computeStats(state);
		expect(stats.durationMs).toBe(2600);
		// 26 chars + 1 newline, skipped indent not counted.
		expect(stats.chars.correct).toBe(26);
		expect(stats.chars.newlines).toBe(1);
		expect(stats.chars.skipped).toBe(4);
		expect(stats.wpm).toBe(Number(wpmFromChars(27, 2600).toFixed(2)));
		expect(stats.raw).toBe(stats.wpm);
		expect(stats.accuracy).toBe(100);
		expect(stats.chart.length).toBe(3);
	});

	test("counts incorrect, extra and missed characters", () => {
		const state = typeText(createTest("abc\ndef"), "axcz\nd");
		const stats = computeStats(state, 10_000);
		expect(stats.chars.incorrect).toBe(1);
		expect(stats.chars.extra).toBe(1);
		expect(stats.chars.missed).toBe(0);
		expect(stats.accuracy).toBeLessThan(100);
		expect(stats.raw).toBeGreaterThan(stats.wpm);
	});

	test("counts missed characters on submitted lines", () => {
		const state = typeText(createTest("abcd\nef"), "ab\ne");
		const stats = computeStats(state, 10_000);
		expect(stats.chars.missed).toBe(2);
	});

	test("reports 100 consistency for a perfectly even pace", () => {
		const text = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		const state = typeText(createTest(text), text, 0, 100);
		const stats = computeStats(state);
		expect(stats.consistency).toBe(100);
	});

	test("kogasa maps zero variation to 100", () => {
		expect(kogasa(0)).toBe(100);
		expect(kogasa(1)).toBeLessThan(50);
	});
});
