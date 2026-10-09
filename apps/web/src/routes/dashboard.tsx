import { createFileRoute, redirect } from "@tanstack/react-router";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { UserProfileCard } from "@/components/dashboard/user-profile-card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (!session) {
			throw redirect({ to: "/login" });
		}
		return { session };
	},
	component: DashboardPage,
});

function DashboardPage() {
	const { session } = Route.useRouteContext();

	return (
		<div className="flex min-h-svh flex-col bg-background">
			<DashboardHeader />
			<main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
				<div className="mb-6 text-center">
					<h2 className="font-semibold text-xl tracking-tight sm:text-2xl">
						Your Profile
					</h2>
					<p className="mt-1 text-muted-foreground text-sm">
						Here are your account details
					</p>
				</div>
				<UserProfileCard
					createdAt={session.user.createdAt}
					email={session.user.email}
					image={session.user.image}
					name={session.user.name}
				/>
			</main>
		</div>
	);
}
