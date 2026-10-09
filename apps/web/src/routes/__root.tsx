import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import "../index.css";

export interface RouterAppContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				title: "ad-stack",
			},
			{
				name: "description",
				content: "ad-stack is a web application",
			},
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
			{import.meta.env.DEV && (
				<>
					<ReactQueryDevtools
						buttonPosition="bottom-right"
						initialIsOpen={false}
					/>
					<TanStackRouterDevtools position="bottom-left" />
				</>
			)}
		</>
	);
}
