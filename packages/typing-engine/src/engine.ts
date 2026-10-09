import type {
	CharState,
	EngineConfig,
	KeyEvent,
	LineState,
	TestState,
} from "./types";
import { DEFAULT_ENGINE_CONFIG } from "./types";

/** Extra characters allowed past the end of a line before input is ignored. */
const MAX_EXTRA_CHARS = 20;

const LEADING_WHITESPACE = /^[ ]*/;

const CRLF = /\r\n?/g;
const TAB = /\t/g;
const TRAILING_NEWLINES = /\n+$/;

export function normalizeText(text: string): string {
	return text
		.replace(CRLF, "\n")
		.replace(TAB, "    ")
		.replace(TRAILING_NEWLINES, "");
}

function leadingIndent(expected: string): string {
	return LEADING_WHITESPACE.exec(expected)?.[0] ?? "";
}

function createLine(expected: string, autoIndent: boolean): LineState {
	const indent = autoIndent ? leadingIndent(expected) : "";
	return { expected, typed: indent, skipped: indent.length, submitted: false };
}

export function createTest(
	text: string,
	config: Partial<EngineConfig> = {}
): TestState {
	const merged: EngineConfig = { ...DEFAULT_ENGINE_CONFIG, ...config };
	const normalized = normalizeText(text);
	const lines = normalized
		.split("\n")
		.map((expected) => createLine(expected, merged.autoIndent));
	return {
		config: merged,
		text: normalized,
		lines,
		lineIndex: 0,
		status: "idle",
		startedAt: null,
		finishedAt: null,
		failReason: null,
		keyLog: [],
		keypresses: { correct: 0, incorrect: 0 },
	};
}

function replaceLine(
	lines: LineState[],
	index: number,
	line: LineState
): LineState[] {
	const next = lines.slice();
	next[index] = line;
	return next;
}

function withKeypress(
	state: TestState,
	time: number,
	ok: boolean,
	nav = false
): TestState {
	const startedAt = state.startedAt ?? time;
	const keyLog = state.keyLog.concat({ t: time - startedAt, ok, nav });
	const keypresses = nav
		? state.keypresses
		: {
				correct: state.keypresses.correct + (ok ? 1 : 0),
				incorrect: state.keypresses.incorrect + (ok ? 0 : 1),
			};
	return { ...state, startedAt, status: "running", keyLog, keypresses };
}

function fail(state: TestState, time: number, reason: string): TestState {
	return { ...state, status: "failed", finishedAt: time, failReason: reason };
}

function isLineComplete(line: LineState, stopOnError: string): boolean {
	if (line.typed.length < line.expected.length) {
		return false;
	}
	return stopOnError === "line" ? line.typed === line.expected : true;
}

function applyChar(state: TestState, char: string, time: number): TestState {
	const line = state.lines[state.lineIndex];
	if (!line) {
		return state;
	}
	const position = line.typed.length;
	const expected = line.expected[position];
	const ok = expected !== undefined && char === expected;
	const isLast = state.lineIndex === state.lines.length - 1;

	if (expected === undefined) {
		// Typing beyond the end of the line.
		if (isLast || position - line.expected.length >= MAX_EXTRA_CHARS) {
			return state;
		}
		if (state.config.stopOnError !== "off") {
			return state;
		}
	}

	if (!ok && state.config.difficulty === "master") {
		return fail(
			withKeypress(state, time, false),
			time,
			"master mode: incorrect key"
		);
	}

	let next = withKeypress(state, time, ok);
	if (!ok && state.config.stopOnError === "letter") {
		return next;
	}

	const updatedLine: LineState = { ...line, typed: line.typed + char };
	next = {
		...next,
		lines: replaceLine(next.lines, next.lineIndex, updatedLine),
	};

	if (isLast && isLineComplete(updatedLine, next.config.stopOnError)) {
		return { ...next, status: "finished", finishedAt: time };
	}
	return next;
}

function applyEnter(state: TestState, time: number): TestState {
	const line = state.lines[state.lineIndex];
	if (!line) {
		return state;
	}
	const isLast = state.lineIndex === state.lines.length - 1;
	if (isLast) {
		return state;
	}
	const nothingTyped = line.typed.length === line.skipped;
	if (nothingTyped && line.expected.trim() !== "") {
		return state;
	}
	const correct = line.typed === line.expected;
	if (!correct && state.config.stopOnError === "line") {
		return withKeypress(state, time, false);
	}
	if (!correct && state.config.difficulty === "expert") {
		return fail(
			withKeypress(state, time, false),
			time,
			"expert mode: incorrect line"
		);
	}
	const next = withKeypress(state, time, correct);
	const submitted: LineState = { ...line, submitted: true };
	const lines = replaceLine(next.lines, next.lineIndex, submitted);
	return { ...next, lines, lineIndex: next.lineIndex + 1 };
}

function applyTab(state: TestState, time: number): TestState {
	let next = state;
	for (let i = 0; i < state.config.indentSize; i++) {
		const line = next.lines[next.lineIndex];
		if (!line || line.expected[line.typed.length] !== " ") {
			break;
		}
		next = applyChar(next, " ", time);
	}
	return next;
}

function wordBoundary(typed: string, floor: number): number {
	let index = typed.length;
	while (index > floor && typed[index - 1] === " ") {
		index--;
	}
	while (index > floor && typed[index - 1] !== " ") {
		index--;
	}
	return index;
}

function applyBackspace(
	state: TestState,
	word: boolean,
	time: number
): TestState {
	if (state.config.confidenceMode === "max") {
		return state;
	}
	const line = state.lines[state.lineIndex];
	if (!line) {
		return state;
	}
	if (line.typed.length > line.skipped) {
		const end = word
			? wordBoundary(line.typed, line.skipped)
			: line.typed.length - 1;
		const updated: LineState = { ...line, typed: line.typed.slice(0, end) };
		const next = withKeypress(state, time, true, true);
		return { ...next, lines: replaceLine(next.lines, next.lineIndex, updated) };
	}
	if (state.lineIndex === 0 || state.config.confidenceMode === "on") {
		return state;
	}
	const previous = state.lines[state.lineIndex - 1];
	if (!previous) {
		return state;
	}
	const canReturn =
		state.config.freedomMode || previous.typed !== previous.expected;
	if (!canReturn) {
		return state;
	}
	const reopened: LineState = { ...previous, submitted: false };
	const next = withKeypress(state, time, true, true);
	return {
		...next,
		lines: replaceLine(next.lines, next.lineIndex - 1, reopened),
		lineIndex: next.lineIndex - 1,
	};
}

export function applyKey(state: TestState, event: KeyEvent): TestState {
	if (state.status === "finished" || state.status === "failed") {
		return state;
	}
	switch (event.type) {
		case "char":
			return applyChar(state, event.char, event.time);
		case "enter":
			return applyEnter(state, event.time);
		case "tab":
			return applyTab(state, event.time);
		case "backspace":
			return applyBackspace(state, event.word, event.time);
		default:
			return state;
	}
}

/** Per-character render states for a line. */
export function charStates(line: LineState): CharState[] {
	const length = Math.max(line.expected.length, line.typed.length);
	const states: CharState[] = [];
	for (let i = 0; i < length; i++) {
		if (i < line.skipped) {
			states.push("skipped");
		} else if (i >= line.typed.length) {
			states.push("pending");
		} else if (i >= line.expected.length) {
			states.push("extra");
		} else if (line.typed[i] === line.expected[i]) {
			states.push("correct");
		} else {
			states.push("incorrect");
		}
	}
	return states;
}

export function caretPosition(state: TestState): { line: number; col: number } {
	const line = state.lines[state.lineIndex];
	return { line: state.lineIndex, col: line?.typed.length ?? 0 };
}

export function progress(state: TestState): number {
	const total = state.text.length;
	if (total === 0) {
		return 0;
	}
	let typed = 0;
	for (let i = 0; i < state.lineIndex; i++) {
		typed += (state.lines[i]?.expected.length ?? 0) + 1;
	}
	typed += state.lines[state.lineIndex]?.typed.length ?? 0;
	return Math.min(1, typed / total);
}
