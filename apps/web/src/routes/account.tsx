import { IconLogout, IconSettings } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { ActivityChart } from "@/components/account/activity-chart";
import { ProfileSummary } from "@/components/account/profile-summary";
import { ResultsTable } from "@/components/account/results-table";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth-client";
import { meQuery } from "@/lib/queries";
import { useConfigStore } from "@/store/config-store";

export const Route = createFileRoute("/account")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
	},
	component: AccountPage,
});

function AccountPage() {
	const navigate = useNavigate();
	const config = useConfigStore((s) => s.config);
	const me = useQuery(meQuery);

	return (
		<div className="flex flex-col gap-8 py-4">
			<div className="flex items-center justify-end gap-2">
				<Button asChild size="sm" variant="ghost">
					<Link to="/settings">
						<IconSettings /> settings
					</Link>
				</Button>
				<Button
					onClick={async () => {
						await signOut();
						navigate({ to: "/" });
					}}
					size="sm"
					variant="ghost"
				>
					<IconLogout /> sign out
				</Button>
			</div>
			{me.isPending && <p className="text-sub">loading…</p>}
			{me.isError && <p className="text-error">could not load your profile</p>}
			{me.data && <ProfileSummary config={config} profile={me.data.profile} />}
			<ActivityChart />
			<ResultsTable config={config} />
		</div>
	);
}
