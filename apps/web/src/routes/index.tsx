import {
	IconBook2,
	IconChevronRight,
	IconRotateClockwise2,
} from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { ExplainDialog } from "@/components/test/explain-dialog";
import { KeyTips } from "@/components/test/key-tips";
import { LiveStats } from "@/components/test/live-stats";
import { ResultView } from "@/components/test/result-view";
import { TestConfigBar } from "@/components/test/test-config-bar";
import { TypingArea } from "@/components/test/typing-area";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTypingTest } from "@/hooks/use-typing-test";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config-store";
import { useTestStore } from "@/store/test-store";
import { useUIStore } from "@/store/ui-store";

export const Route = createFileRoute("/")({
	component: TestPage,
});

function TestPage() {
	const config = useConfigStore((s) => s.config);
	const {
		phase,
		snippet,
		test,
		handleKeyDown,
		handleInsertText,
		nextTest,
		repeatTest,
	} = useTypingTest();
	const result = useTestStore((s) => s.result);
	const errorMessage = useTestStore((s) => s.errorMessage);
	const testId = useTestStore((s) => s.testId);
	const setExplainOpen = useUIStore((s) => s.setExplainOpen);
	const running = test?.status === "running";

	return (
		<div className="flex flex-1 flex-col justify-center gap-6 py-4">
			{phase === "result" && result ? (
				<ResultView
					config={config}
					onNext={nextTest}
					onRepeat={repeatTest}
					result={result}
				/>
			) : (
				<>
					<div
						className={cn(
							"transition-opacity duration-200",
							running && "pointer-events-none opacity-0"
						)}
					>
						<TestConfigBar />
					</div>
					<div className="flex min-h-[40vh] flex-col justify-center gap-2">
						{phase === "loading" && (
							<p className="text-center text-sub">loading snippet…</p>
						)}
						{phase === "error" && (
							<div className="flex flex-col items-center gap-3">
								<p className="text-center text-error">{errorMessage}</p>
								<Button onClick={() => nextTest()} variant="outline">
									try again
								</Button>
							</div>
						)}
						{phase === "typing" && test && snippet && (
							<>
								<div className="flex items-center justify-between gap-4">
									<LiveStats config={config} test={test} />
									<div
										className={cn(
											"flex items-center gap-2 text-sm text-sub transition-opacity duration-200",
											running && "opacity-0"
										)}
									>
										<span>{snippet.algorithm.name.toLowerCase()}</span>
										<span className="text-sub-alt">·</span>
										<span>{snippet.algorithm.difficulty}</span>
										<span className="text-sub-alt">·</span>
										<span>{snippet.lineCount} lines</span>
									</div>
								</div>
								<TypingArea
									config={config}
									onInsertText={handleInsertText}
									onKeyDown={handleKeyDown}
									test={test}
									testId={testId}
								/>
							</>
						)}
					</div>
					<div className="flex items-center justify-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									aria-label="Restart test"
									onClick={nextTest}
									size="lg"
									variant="ghost"
								>
									<IconChevronRight />
								</Button>
							</TooltipTrigger>
							<TooltipContent>next test</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									aria-label="Repeat test"
									onClick={repeatTest}
									size="lg"
									variant="ghost"
								>
									<IconRotateClockwise2 />
								</Button>
							</TooltipTrigger>
							<TooltipContent>restart test</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									aria-label="Explain algorithm"
									disabled={!snippet}
									onClick={() => setExplainOpen(true)}
									size="lg"
									variant="ghost"
								>
									<IconBook2 />
								</Button>
							</TooltipTrigger>
							<TooltipContent>explain algorithm</TooltipContent>
						</Tooltip>
					</div>
					{config.keyTips && (
						<div
							className={cn(
								"transition-opacity duration-200",
								running && "opacity-0"
							)}
						>
							<KeyTips config={config} />
						</div>
					)}
				</>
			)}
			<ExplainDialog />
		</div>
	);
}
