import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MIN_LEADERBOARD_ACCURACY } from "@type-ninja/shared/api";
import { useState } from "react";
import { OptionButton } from "@/components/settings/setting-group";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/auth-client";
import { formatDate, formatPercent, formatSpeed } from "@/lib/format";
import { leaderboardQuery, useAlgorithms, useLanguages } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config-store";

export const Route = createFileRoute("/leaderboards")({
	component: LeaderboardsPage,
});

const PAGE_SIZE = 50;

function LeaderboardsPage() {
	const config = useConfigStore((s) => s.config);
	const { data: session } = useSession();
	const languages = useLanguages();
	const algorithms = useAlgorithms();
	const [language, setLanguage] = useState(config.language);
	const [period, setPeriod] = useState<"all-time" | "daily">("all-time");
	const [algorithm, setAlgorithm] = useState<string>("");
	const [page, setPage] = useState(0);
	const board = useQuery(
		leaderboardQuery({
			language,
			period,
			algorithm: algorithm || undefined,
			page,
			pageSize: PAGE_SIZE,
		})
	);
	const pages = Math.max(1, Math.ceil((board.data?.total ?? 0) / PAGE_SIZE));

	return (
		<div className="flex flex-col gap-6 py-4">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-semibold text-3xl text-main">leaderboards</h1>
					<p className="text-sm text-sub">
						best run per user with at least {MIN_LEADERBOARD_ACCURACY}%
						accuracy. blind mode runs are excluded.
					</p>
				</div>
				<div className="flex gap-1">
					<OptionButton
						active={period === "all-time"}
						onClick={() => {
							setPeriod("all-time");
							setPage(0);
						}}
					>
						all-time
					</OptionButton>
					<OptionButton
						active={period === "daily"}
						onClick={() => {
							setPeriod("daily");
							setPage(0);
						}}
					>
						daily
					</OptionButton>
				</div>
			</div>

			<div className="flex flex-wrap gap-1">
				{(languages.data?.languages ?? []).map((l) => (
					<OptionButton
						active={language === l.id}
						key={l.id}
						onClick={() => {
							setLanguage(l.id);
							setPage(0);
						}}
					>
						{l.name.toLowerCase()}
					</OptionButton>
				))}
			</div>

			<div className="flex flex-wrap items-center gap-2 text-sm text-sub">
				<label htmlFor="algorithm-filter">algorithm</label>
				<select
					className="rounded-md bg-sub-alt px-2 py-1 text-text"
					id="algorithm-filter"
					onChange={(e) => {
						setAlgorithm(e.target.value);
						setPage(0);
					}}
					value={algorithm}
				>
					<option value="">any</option>
					{(algorithms.data?.algorithms ?? []).map((a) => (
						<option key={a.slug} value={a.slug}>
							{a.name}
						</option>
					))}
				</select>
			</div>

			{board.data?.me && (
				<p className="text-sm text-sub">
					you are ranked{" "}
					<span className="text-main">#{board.data.me.rank}</span> with{" "}
					<span className="text-main">
						{formatSpeed(board.data.me.wpm, config)}
					</span>{" "}
					{config.typingSpeedUnit}
				</p>
			)}

			<div className="overflow-x-auto rounded-lg bg-sub-alt">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="text-sub">#</TableHead>
							<TableHead className="text-sub">name</TableHead>
							<TableHead className="text-sub">
								{config.typingSpeedUnit}
							</TableHead>
							<TableHead className="text-sub">acc</TableHead>
							<TableHead className="text-sub">raw</TableHead>
							<TableHead className="text-sub">consistency</TableHead>
							<TableHead className="text-sub">algorithm</TableHead>
							<TableHead className="text-sub">date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{board.isPending && (
							<TableRow>
								<TableCell className="text-sub" colSpan={8}>
									loading…
								</TableCell>
							</TableRow>
						)}
						{board.data?.entries.length === 0 && (
							<TableRow>
								<TableCell className="text-sub" colSpan={8}>
									no entries yet. be the first!
								</TableCell>
							</TableRow>
						)}
						{board.data?.entries.map((entry) => (
							<TableRow
								className={cn(
									entry.userId === session?.user.id && "bg-bg/40 text-main"
								)}
								key={entry.userId}
							>
								<TableCell>{entry.rank}</TableCell>
								<TableCell>
									<Link
										className="hover:text-main"
										params={{ username: entry.username }}
										to="/profile/$username"
									>
										{entry.username}
									</Link>
								</TableCell>
								<TableCell className="text-main">
									{formatSpeed(entry.wpm, config)}
								</TableCell>
								<TableCell>{formatPercent(entry.accuracy, config)}</TableCell>
								<TableCell>{formatSpeed(entry.raw, config)}</TableCell>
								<TableCell>
									{formatPercent(entry.consistency, config)}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{entry.algorithmName.toLowerCase()}
								</TableCell>
								<TableCell className="whitespace-nowrap">
									{formatDate(entry.achievedAt)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			{pages > 1 && (
				<div className="flex items-center justify-end gap-2 text-sm text-sub">
					<Button
						disabled={page === 0}
						onClick={() => setPage((p) => p - 1)}
						size="sm"
						variant="ghost"
					>
						previous
					</Button>
					<span>
						page {page + 1} / {pages}
					</span>
					<Button
						disabled={page + 1 >= pages}
						onClick={() => setPage((p) => p + 1)}
						size="sm"
						variant="ghost"
					>
						next
					</Button>
				</div>
			)}
		</div>
	);
}
