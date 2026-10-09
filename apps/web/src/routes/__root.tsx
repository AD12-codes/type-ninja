import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/command-palette";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useConfigSync } from "@/hooks/use-config-sync";
import { useApplyAppearance } from "@/hooks/use-theme";

import "../index.css";

export interface RouterAppContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{ title: "typeninja | code typing test" },
			{
				name: "description",
				content:
					"A minimalistic typing test for programmers. Type real algorithms in Python, JavaScript, Go, Rust and more; track your wpm and climb the leaderboard.",
			},
		],
	}),
});

function RootComponent() {
	useApplyAppearance();
	useConfigSync();

	return (
		<TooltipProvider delayDuration={200}>
			<HeadContent />
			<div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 sm:px-8">
				<Header />
				<main className="flex flex-1 flex-col">
					<Outlet />
				</main>
				<Footer />
			</div>
			<CommandPalette />
			<Toaster
				position="bottom-right"
				theme="dark"
				toastOptions={{
					style: {
						background: "var(--sub-alt-color)",
						color: "var(--text-color)",
						border: "none",
					},
				}}
			/>
			{import.meta.env.DEV && (
				<>
					<ReactQueryDevtools
						buttonPosition="bottom-right"
						initialIsOpen={false}
					/>
					<TanStackRouterDevtools position="bottom-left" />
				</>
			)}
		</TooltipProvider>
	);
}
