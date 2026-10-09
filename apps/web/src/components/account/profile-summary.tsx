import type { ProfileDto } from "@type-ninja/shared/api";
import type { UserConfig } from "@type-ninja/shared/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	formatDate,
	formatDuration,
	formatPercent,
	formatSpeed,
} from "@/lib/format";
import { useLanguages } from "@/lib/queries";

interface ProfileSummaryProps {
	profile: ProfileDto;
	config: Pick<UserConfig, "typingSpeedUnit" | "alwaysShowDecimalPlaces">;
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col">
			<span className="text-sub text-xs">{label}</span>
			<span className="text-2xl text-text">{value}</span>
		</div>
	);
}

export function ProfileSummary({ profile, config }: ProfileSummaryProps) {
	const languages = useLanguages();
	const languageName = (id: string) =>
		languages.data?.languages.find((l) => l.id === id)?.name ?? id;
	const bestRank = profile.ranks.length
		? Math.min(...profile.ranks.map((r) => r.rank))
		: null;

	return (
		<div className="flex flex-col gap-6 rounded-lg bg-sub-alt p-6">
			<div className="flex flex-wrap items-center gap-6">
				<Avatar className="size-20">
					{profile.image && (
						<AvatarImage alt={profile.username} src={profile.image} />
					)}
					<AvatarFallback className="bg-bg text-2xl text-main">
						{profile.username.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col">
					<span className="font-semibold text-3xl text-text">
						{profile.username}
					</span>
					<span className="text-sm text-sub">
						joined {formatDate(profile.joinedAt)}
					</span>
					{profile.bio && (
						<p className="mt-1 text-sm text-text">{profile.bio}</p>
					)}
					{profile.keyboard && (
						<p className="text-sub text-xs">keyboard: {profile.keyboard}</p>
					)}
				</div>
				<div className="ml-auto grid grid-cols-3 gap-6">
					<Metric
						label="tests started"
						value={String(profile.stats.testsStarted)}
					/>
					<Metric
						label="tests completed"
						value={String(profile.stats.testsCompleted)}
					/>
					<Metric
						label="time typing"
						value={formatDuration(profile.stats.timeTypingMs)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
				<Metric
					label={`highest ${config.typingSpeedUnit}`}
					value={formatSpeed(profile.stats.highestWpm, config)}
				/>
				<Metric
					label={`average ${config.typingSpeedUnit}`}
					value={formatSpeed(profile.stats.averageWpm, config)}
				/>
				<Metric
					label="average accuracy"
					value={formatPercent(profile.stats.averageAccuracy, config)}
				/>
				<Metric label="best rank" value={bestRank ? `#${bestRank}` : "-"} />
			</div>

			{profile.languageBests.length > 0 && (
				<div className="flex flex-col gap-2">
					<span className="text-sub text-xs">language bests</span>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
						{profile.languageBests.map((best) => {
							const rank = profile.ranks.find(
								(r) => r.language === best.language
							);
							return (
								<div className="rounded-md bg-bg p-3" key={best.language}>
									<div className="text-sub text-xs">
										{languageName(best.language).toLowerCase()}
									</div>
									<div className="text-main text-xl">
										{formatSpeed(best.wpm, config)}
									</div>
									<div className="text-sub text-xs">
										{formatPercent(best.accuracy, config)}
										{rank ? ` · #${rank.rank}` : ""}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
