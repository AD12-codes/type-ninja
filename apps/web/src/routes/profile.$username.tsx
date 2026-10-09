import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProfileSummary } from "@/components/account/profile-summary";
import { formatDate, formatPercent, formatSpeed } from "@/lib/format";
import { profileQuery } from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

export const Route = createFileRoute("/profile/$username")({
	component: ProfilePage,
});

function ProfilePage() {
	const { username } = Route.useParams();
	const config = useConfigStore((s) => s.config);
	const profile = useQuery(profileQuery(username));

	if (profile.isPending) {
		return <p className="py-8 text-sub">loading…</p>;
	}
	if (profile.isError || !profile.data) {
		return <p className="py-8 text-error">user not found</p>;
	}
	const { personalBests } = profile.data.profile;

	return (
		<div className="flex flex-col gap-8 py-4">
			<ProfileSummary config={config} profile={profile.data.profile} />
			{personalBests.length > 0 && (
				<div className="flex flex-col gap-2">
					<h2 className="font-semibold text-main text-xl">personal bests</h2>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
						{personalBests.map((pb) => (
							<div
								className="rounded-md bg-sub-alt p-3"
								key={`${pb.language}-${pb.algorithmSlug}`}
							>
								<div className="text-sub text-xs">
									{pb.language} · {pb.algorithmName.toLowerCase()}
								</div>
								<div className="text-main text-xl">
									{formatSpeed(pb.wpm, config)}
								</div>
								<div className="text-sub text-xs">
									{formatPercent(pb.accuracy, config)} ·{" "}
									{formatDate(pb.achievedAt)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
