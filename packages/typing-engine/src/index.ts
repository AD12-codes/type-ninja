export {
	applyKey,
	caretPosition,
	charStates,
	createTest,
	normalizeText,
	progress,
} from "./engine";
export {
	buildChart,
	coefficientOfVariation,
	computeStats,
	countChars,
	kogasa,
	liveWpm,
	roundTo,
	wpmFromChars,
} from "./stats";
export {
	type CharCounts,
	type CharState,
	type ChartPoint,
	type ConfidenceMode,
	DEFAULT_ENGINE_CONFIG,
	type Difficulty,
	type EngineConfig,
	type KeyEvent,
	type KeyLogEntry,
	type LineState,
	type StopOnError,
	type TestState,
	type TestStats,
	type TestStatus,
} from "./types";
