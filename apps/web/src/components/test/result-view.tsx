import {
	IconBook2,
	IconChevronRight,
	IconRotateClockwise2,
	IconTrophy,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { UserConfig } from "@type-ninja/shared/config";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import {
	convertSpeed,
	formatPercent,
	formatSeconds,
	formatSpeed,
} from "@/lib/format";
import type { FinishedResult } from "@/store/test-store";
import { useUIStore } from "@/store/ui-store";
import { ResultChart } from "./result-chart";

interface ResultViewProps {
	result: FinishedResult;
	config: UserConfig;
	onNext: () => void;
	onRepeat: () => void;
}

function Stat({
	label,
	value,
	hint,
	big,
}: {
	label: string;
	value: string;
	hint?: string;
	big?: boolean;
}) {
	const content = (
		<div className="flex flex-col">
			<span className={big ? "text-2xl text-sub" : "text-sm text-sub"}>
				{label}
			</span>
			<span
				className={
					big
						? "font-medium text-6xl text-main leading-none"
						: "text-2xl text-main"
				}
			>
				{value}
			</span>
		</div>
	);
	if (!hint) {
		return content;
	}
	return (
		<Tooltip>
			<TooltipTrigger asChild>{content}</TooltipTrigger>
			<TooltipContent>{hint}</TooltipContent>
		</Tooltip>
	);
}

export function ResultView({
	result,
	config,
	onNext,
	onRepeat,
}: ResultViewProps) {
	const { data: session } = useSession();
	const setExplainOpen = useUIStore((s) => s.setExplainOpen);
	const { stats, snippet, submission } = result;
	const unit = config.typingSpeedUnit;
	const decimals = {
		typingSpeedUnit: unit,
		alwaysShowDecimalPlaces: config.alwaysShowDecimalPlaces,
	};
	const chars = stats.chars;

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-6 md:grid-cols-[auto_1fr]">
				<div className="flex flex-col gap-4">
					<Stat
						big
						hint={`${convertSpeed(stats.wpm, unit).toFixed(2)} ${unit}`}
						label={unit}
						value={formatSpeed(stats.wpm, decimals)}
					/>
					<Stat
						big
						hint={`${stats.accuracy.toFixed(2)}%`}
						label="acc"
						value={formatPercent(stats.accuracy, decimals)}
					/>
				</div>
				<div className="min-w-0">
					<ResultChart chart={stats.chart} unit={unit} />
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
				<div className="flex flex-col">
					<span className="text-sm text-sub">test type</span>
					<span className="text-main text-sm">
						{snippet.language.name.toLowerCase()}
						<br />
						{snippet.algorithm.name.toLowerCase()}
						<br />
						{result.config.difficulty}
						{result.config.stopOnError !== "off" && (
							<>
								<br />
								stop on {result.config.stopOnError}
							</>
						)}
						{result.config.blindMode && (
							<>
								<br />
								blind
							</>
						)}
					</span>
				</div>
				<Stat
					hint={`${convertSpeed(stats.raw, unit).toFixed(2)} ${unit}`}
					label="raw"
					value={formatSpeed(stats.raw, decimals)}
				/>
				<Stat
					hint="correct / incorrect / extra / missed"
					label="characters"
					value={`${chars.correct}/${chars.incorrect}/${chars.extra}/${chars.missed}`}
				/>
				<Stat
					hint={`${stats.consistency.toFixed(2)}%`}
					label="consistency"
					value={formatPercent(stats.consistency, decimals)}
				/>
				<Stat
					hint={`${stats.durationMs} ms`}
					label="time"
					value={formatSeconds(stats.durationMs)}
				/>
				<div className="flex flex-col">
					<span className="text-sm text-sub">lines</span>
					<span className="text-2xl text-main">{snippet.lineCount}</span>
				</div>
			</div>

			{submission && (
				<div className="flex flex-wrap items-center gap-3 text-sm text-sub">
					{submission.isPersonalBest && (
						<span className="flex items-center gap-1 text-main">
							<IconTrophy className="size-4" /> personal best for this algorithm
						</span>
					)}
					{submission.isLanguageBest && (
						<span className="text-main">new {snippet.language.name} best</span>
					)}
					{submission.leaderboardRank !== null && (
						<span>
							leaderboard rank #{submission.leaderboardRank} ·{" "}
							<Link className="underline hover:text-text" to="/leaderboards">
								view
							</Link>
						</span>
					)}
				</div>
			)}
			{result.saving && <p className="text-sm text-sub">saving result…</p>}
			{result.submissionError && (
				<p className="text-error text-sm">{result.submissionError}</p>
			)}
			{!session?.user && (
				<p className="text-sm text-sub">
					<Link className="text-main hover:underline" to="/login">
						sign in
					</Link>{" "}
					to save your results, track progress and join the leaderboard
				</p>
			)}

			<div className="flex flex-wrap items-center justify-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label="Next test"
							onClick={onNext}
							size="lg"
							variant="ghost"
						>
							<IconChevronRight />
							<span className="sr-only">next test</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>next test</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label="Repeat test"
							onClick={onRepeat}
							size="lg"
							variant="ghost"
						>
							<IconRotateClockwise2 />
							<span className="sr-only">repeat test</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>repeat test</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							aria-label="Explain algorithm"
							onClick={() => setExplainOpen(true)}
							size="lg"
							variant="ghost"
						>
							<IconBook2 />
							<span className="sr-only">explain algorithm</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						explain {snippet.algorithm.name.toLowerCase()}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
