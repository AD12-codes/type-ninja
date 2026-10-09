import { createFileRoute, redirect } from "@tanstack/react-router";

import { AuthCard } from "@/components/auth/auth-card";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	return (
		<main className="flex min-h-svh flex-col items-center justify-center bg-background px-4">
			<div className="mb-8 text-center">
				<h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
					type-ninja
				</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Organize your life, one grid at a time
				</p>
			</div>
			<AuthCard mode="login" />
			<p className="mt-6 text-center text-muted-foreground text-xs">
				Don&apos;t have an account?{" "}
				<a
					className="text-primary underline-offset-4 hover:underline"
					href="/signup"
				>
					Sign up
				</a>
			</p>
		</main>
	);
}
