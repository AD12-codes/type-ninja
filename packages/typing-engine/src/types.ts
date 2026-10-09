/**
 * Core types for the typing engine.
 *
 * The engine is a pure state machine: `createTest` builds the initial state
 * from a snippet and `applyKey` returns a new state for every key event. The
 * UI only renders the state and the server re-validates the derived stats.
 */

export type StopOnError = "off" | "letter" | "line";
export type Difficulty = "normal" | "expert" | "master";
export type ConfidenceMode = "off" | "on" | "max";

export interface EngineConfig {
	/** Stop the caret from advancing past an incorrect letter / line. */
	stopOnError: StopOnError;
	/** `expert` fails on an incorrect line, `master` fails on any wrong key. */
	difficulty: Difficulty;
	/**
	 * Skip leading indentation when moving to a new line. Skipped characters are
	 * not counted toward speed, so this never inflates results.
	 */
	autoIndent: boolean;
	/** Allow backspacing into lines that were already submitted correctly. */
	freedomMode: boolean;
	/** `on` disables backspacing into previous lines, `max` disables backspace. */
	confidenceMode: ConfidenceMode;
	/** Treat the Tab key as typing one indent unit of spaces. */
	indentSize: number;
}

export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
	stopOnError: "off",
	difficulty: "normal",
	autoIndent: true,
	freedomMode: false,
	confidenceMode: "off",
	indentSize: 4,
};

export type CharState =
	| "pending"
	| "correct"
	| "incorrect"
	| "extra"
	| "skipped";

export interface LineState {
	/** The expected text for this line (without the newline). */
	expected: string;
	/** What the user has typed on this line so far, including extra chars. */
	typed: string;
	/** Number of leading characters pre-filled by auto indent. */
	skipped: number;
	/** Whether the user has pressed Enter on this line. */
	submitted: boolean;
}

export type KeyEvent =
	| { type: "char"; char: string; time: number }
	| { type: "enter"; time: number }
	| { type: "tab"; time: number }
	| { type: "backspace"; word: boolean; time: number };

export interface KeyLogEntry {
	/** Milliseconds since the test started. */
	t: number;
	/** Whether the key produced a correct character. */
	ok: boolean;
	/** True for backspace / navigation keys that are not scored. */
	nav?: boolean;
}

export type TestStatus = "idle" | "running" | "finished" | "failed";

export interface TestState {
	config: EngineConfig;
	text: string;
	lines: LineState[];
	lineIndex: number;
	status: TestStatus;
	/** Timestamp of the first scored keypress, or null before the test starts. */
	startedAt: number | null;
	finishedAt: number | null;
	failReason: string | null;
	keyLog: KeyLogEntry[];
	/** Counters that are updated on every keypress. */
	keypresses: { correct: number; incorrect: number };
}

export interface CharCounts {
	correct: number;
	incorrect: number;
	extra: number;
	missed: number;
	/** Correctly entered newlines (they count like spaces in monkeytype). */
	newlines: number;
	/** Characters pre-filled by auto indent; never scored. */
	skipped: number;
}

export interface ChartPoint {
	second: number;
	wpm: number;
	raw: number;
	errors: number;
}

export interface TestStats {
	wpm: number;
	raw: number;
	/** Percentage 0-100 of keypresses that were correct. */
	accuracy: number;
	/** Percentage 0-100, monkeytype's kogasa consistency score. */
	consistency: number;
	durationMs: number;
	chars: CharCounts;
	chart: ChartPoint[];
}
