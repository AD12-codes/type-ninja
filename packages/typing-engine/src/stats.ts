import type {
	CharCounts,
	ChartPoint,
	KeyLogEntry,
	LineState,
	TestState,
	TestStats,
} from "./types";

const CHARS_PER_WORD = 5;
const MS_PER_MINUTE = 60_000;
const MS_PER_SECOND = 1000;
const PERCENT = 100;

export function countChars(lines: LineState[], lineIndex: number): CharCounts {
	const counts: CharCounts = {
		correct: 0,
		incorrect: 0,
		extra: 0,
		missed: 0,
		newlines: 0,
		skipped: 0,
	};
	lines.forEach((line, index) => {
		counts.skipped += line.skipped;
		const expected = line.expected;
		const typed = line.typed;
		for (let i = line.skipped; i < typed.length; i++) {
			if (i >= expected.length) {
				counts.extra++;
			} else if (typed[i] === expected[i]) {
				counts.correct++;
			} else {
				counts.incorrect++;
			}
		}
		if (line.submitted || index < lineIndex) {
			counts.missed += Math.max(0, expected.length - typed.length);
			if (index < lines.length - 1) {
				counts.newlines++;
			}
		}
	});
	return counts;
}

export function roundTo(value: number, decimals: number): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

export function wpmFromChars(chars: number, durationMs: number): number {
	if (durationMs <= 0) {
		return 0;
	}
	return (chars / CHARS_PER_WORD) * (MS_PER_MINUTE / durationMs);
}

/**
 * monkeytype's consistency metric: 100 * (1 - tanh(cov + cov^3/3 + cov^5/5))
 * where cov is the coefficient of variation of the per-second raw speeds.
 */
export function kogasa(cov: number): number {
	const value = cov + cov ** 3 / 3 + cov ** 5 / 5;
	return PERCENT * (1 - Math.tanh(value));
}

export function coefficientOfVariation(values: number[]): number {
	if (values.length === 0) {
		return 0;
	}
	const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
	if (mean === 0) {
		return 0;
	}
	const variance =
		values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
	return Math.sqrt(variance) / mean;
}

export function buildChart(
	keyLog: KeyLogEntry[],
	durationMs: number
): ChartPoint[] {
	const seconds = Math.max(1, Math.ceil(durationMs / MS_PER_SECOND));
	const perSecondChars = new Array<number>(seconds).fill(0);
	const perSecondErrors = new Array<number>(seconds).fill(0);
	let cumulativeCorrect = 0;
	const cumulativeBySecond = new Array<number>(seconds).fill(0);

	for (const entry of keyLog) {
		if (entry.nav) {
			continue;
		}
		const bucket = Math.min(seconds - 1, Math.floor(entry.t / MS_PER_SECOND));
		const current = perSecondChars[bucket] ?? 0;
		perSecondChars[bucket] = current + 1;
		if (entry.ok) {
			cumulativeCorrect++;
		} else {
			const errors = perSecondErrors[bucket] ?? 0;
			perSecondErrors[bucket] = errors + 1;
		}
		cumulativeBySecond[bucket] = cumulativeCorrect;
	}

	let lastCumulative = 0;
	return perSecondChars.map((chars, index) => {
		const second = index + 1;
		const cumulative = cumulativeBySecond[index] ?? 0;
		if (cumulative > 0) {
			lastCumulative = cumulative;
		}
		const elapsedMs = Math.min(durationMs, second * MS_PER_SECOND);
		return {
			second,
			wpm: roundTo(wpmFromChars(lastCumulative, elapsedMs), 2),
			raw: roundTo(wpmFromChars(chars, MS_PER_SECOND), 2),
			errors: perSecondErrors[index] ?? 0,
		};
	});
}

export function computeStats(state: TestState, now?: number): TestStats {
	const start = state.startedAt;
	const end = state.finishedAt ?? now ?? start ?? 0;
	const durationMs = start === null ? 0 : Math.max(0, Math.round(end - start));
	const chars = countChars(state.lines, state.lineIndex);
	const totalKeypresses = state.keypresses.correct + state.keypresses.incorrect;
	const accuracy =
		totalKeypresses === 0
			? PERCENT
			: (state.keypresses.correct / totalKeypresses) * PERCENT;
	const correctScored = chars.correct + chars.newlines;
	const rawScored = correctScored + chars.incorrect + chars.extra;
	const chart = buildChart(state.keyLog, durationMs);
	const rawSpeeds = chart.map((p) => p.raw).filter((r) => r > 0);
	const consistency = kogasa(coefficientOfVariation(rawSpeeds));

	return {
		wpm: roundTo(wpmFromChars(correctScored, durationMs), 2),
		raw: roundTo(wpmFromChars(rawScored, durationMs), 2),
		accuracy: roundTo(accuracy, 2),
		consistency: roundTo(consistency, 2),
		durationMs,
		chars,
		chart,
	};
}

/** Live speed while the test is running, for the live wpm indicator. */
export function liveWpm(state: TestState, now: number): number {
	if (state.startedAt === null) {
		return 0;
	}
	const chars = countChars(state.lines, state.lineIndex);
	return Math.round(
		wpmFromChars(chars.correct + chars.newlines, now - state.startedAt)
	);
}
