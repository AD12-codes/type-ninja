import type { SnippetDto, SubmitResultResponse } from "@type-ninja/shared/api";
import type { UserConfig } from "@type-ninja/shared/config";
import {
	applyKey,
	computeStats,
	createTest,
	type KeyEvent,
	type TestState,
	type TestStats,
} from "@type-ninja/typing-engine";
import { create } from "zustand";

export type TestPhase = "loading" | "typing" | "result" | "error";

export interface FinishedResult {
	snippet: SnippetDto;
	stats: TestStats;
	state: TestState;
	config: Pick<
		UserConfig,
		"difficulty" | "stopOnError" | "autoIndent" | "blindMode"
	>;
	submission: SubmitResultResponse | null;
	submissionError: string | null;
	saving: boolean;
}

interface TestStoreState {
	phase: TestPhase;
	snippet: SnippetDto | null;
	test: TestState | null;
	restartCount: number;
	result: FinishedResult | null;
	errorMessage: string | null;
	/** Bumps every time a new test is started so components can reset. */
	testId: number;
	startLoading: () => void;
	setError: (message: string) => void;
	beginTest: (snippet: SnippetDto, config: UserConfig) => void;
	dispatch: (event: KeyEvent) => TestState | null;
	finish: (config: UserConfig) => FinishedResult | null;
	setSubmission: (patch: Partial<FinishedResult>) => void;
	countRestart: () => void;
	resetRestartCount: () => void;
}

export function engineConfig(config: UserConfig, indentSize: number) {
	return {
		stopOnError: config.stopOnError,
		difficulty: config.difficulty,
		autoIndent: config.autoIndent,
		freedomMode: config.freedomMode,
		confidenceMode: config.confidenceMode,
		indentSize,
	};
}

export const useTestStore = create<TestStoreState>()((set, get) => ({
	phase: "loading",
	snippet: null,
	test: null,
	restartCount: 0,
	result: null,
	errorMessage: null,
	testId: 0,
	startLoading: () => set({ phase: "loading", errorMessage: null }),
	setError: (message) => set({ phase: "error", errorMessage: message }),
	beginTest: (snippet, config) =>
		set((state) => ({
			phase: "typing",
			snippet,
			test: createTest(
				snippet.code,
				engineConfig(config, snippet.language.indent)
			),
			result: null,
			errorMessage: null,
			testId: state.testId + 1,
		})),
	dispatch: (event) => {
		const current = get().test;
		if (!current) {
			return null;
		}
		const next = applyKey(current, event);
		if (next !== current) {
			set({ test: next });
		}
		return next;
	},
	finish: (config) => {
		const { test, snippet } = get();
		if (!(test && snippet)) {
			return null;
		}
		const result: FinishedResult = {
			snippet,
			stats: computeStats(test),
			state: test,
			config: {
				difficulty: config.difficulty,
				stopOnError: config.stopOnError,
				autoIndent: config.autoIndent,
				blindMode: config.blindMode,
			},
			submission: null,
			submissionError: null,
			saving: false,
		};
		set({ phase: "result", result });
		return result;
	},
	setSubmission: (patch) =>
		set((state) =>
			state.result ? { result: { ...state.result, ...patch } } : {}
		),
	countRestart: () =>
		set((state) => ({ restartCount: state.restartCount + 1 })),
	resetRestartCount: () => set({ restartCount: 0 }),
}));
