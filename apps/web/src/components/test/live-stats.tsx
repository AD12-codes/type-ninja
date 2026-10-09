import type { UserConfig } from "@type-ninja/shared/config";
import { countChars, liveWpm, type TestState } from "@type-ninja/typing-engine";
import { useEffect, useState } from "react";
import { convertSpeed, formatDuration } from "@/lib/format";

interface LiveStatsProps {
	test: TestState;
	config: UserConfig;
}

const TICK_MS = 200;
const PERCENT = 100;

export function LiveStats({ test, config }: LiveStatsProps) {
	const [now, setNow] = useState(() => performance.now());

	// Keep the clock fresh on every keystroke too, since timers pause in hidden tabs.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs per keystroke
	useEffect(() => {
		setNow(performance.now());
	}, [test]);

	useEffect(() => {
		if (test.status !== "running") {
			return;
		}
		const timer = window.setInterval(() => setNow(performance.now()), TICK_MS);
		return () => window.clearInterval(timer);
	}, [test.status]);

	const running = test.status === "running" && test.startedAt !== null;
	const elapsed = running ? now - (test.startedAt ?? now) : 0;
	const speed = running
		? Math.round(convertSpeed(liveWpm(test, now), config.typingSpeedUnit))
		: 0;
	const keypresses = test.keypresses.correct + test.keypresses.incorrect;
	const accuracy =
		keypresses === 0
			? PERCENT
			: Math.round((test.keypresses.correct / keypresses) * PERCENT);
	const completed = countChars(test.lines, test.lineIndex);
	const hasAnything =
		config.liveTimer ||
		config.liveSpeed ||
		config.liveAccuracy ||
		config.liveProgress;
	if (!hasAnything) {
		return <div className="h-7" />;
	}

	return (
		<div
			className="flex h-7 items-center gap-6 text-main text-xl transition-opacity"
			style={{ opacity: running ? 1 : 0 }}
		>
			{config.liveTimer && <span>{formatDuration(elapsed)}</span>}
			{config.liveSpeed && (
				<span>
					{speed}{" "}
					<span className="text-sm text-sub">{config.typingSpeedUnit}</span>
				</span>
			)}
			{config.liveAccuracy && <span>{accuracy}%</span>}
			{config.liveProgress && (
				<span className="text-sm text-sub">
					{Math.min(test.lineIndex + 1, test.lines.length)}/{test.lines.length}{" "}
					lines
					{completed.incorrect + completed.extra > 0 && (
						<span className="text-error">
							{" "}
							· {completed.incorrect + completed.extra} errors
						</span>
					)}
				</span>
			)}
		</div>
	);
}
