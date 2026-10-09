import {
	IconCrown,
	IconInfoCircle,
	IconKeyboard,
	IconListDetails,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTestStore } from "@/store/test-store";

const NAV = [
	{ to: "/", label: "typing test", icon: IconKeyboard },
	{ to: "/algorithms", label: "algorithms", icon: IconListDetails },
	{ to: "/leaderboards", label: "leaderboards", icon: IconCrown },
	{ to: "/about", label: "about", icon: IconInfoCircle },
	{ to: "/settings", label: "settings", icon: IconSettings },
] as const;

export function Header() {
	const { data: session } = useSession();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const running = useTestStore(
		(s) => s.phase === "typing" && s.test?.status === "running"
	);
	const hide = running && pathname === "/";

	return (
		<header
			className={cn(
				"flex items-center justify-between gap-4 py-6 transition-opacity duration-200",
				hide && "pointer-events-none opacity-0"
			)}
		>
			<div className="flex items-center gap-6">
				<Link className="group flex items-center gap-2" to="/">
					<IconKeyboard className="size-8 text-sub transition-colors group-hover:text-text" />
					<div className="flex flex-col leading-none">
						<span className="text-[0.6rem] text-sub">see your code speed</span>
						<span className="font-semibold text-2xl text-text tracking-tight">
							type<span className="text-main">ninja</span>
						</span>
					</div>
				</Link>
				<nav className="flex items-center gap-1">
					{NAV.map((item) => (
						<Tooltip key={item.to}>
							<TooltipTrigger asChild>
								<Link
									activeOptions={{ exact: item.to === "/" }}
									activeProps={{ className: "text-text" }}
									className="rounded p-2 text-sub transition-colors hover:text-text"
									to={item.to}
								>
									<item.icon className="size-5" />
									<span className="sr-only">{item.label}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent>{item.label}</TooltipContent>
						</Tooltip>
					))}
				</nav>
			</div>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						className="flex items-center gap-2 rounded p-2 text-sub transition-colors hover:text-text"
						to={session?.user ? "/account" : "/login"}
					>
						<IconUser className="size-5" />
						{session?.user && (
							<span className="text-sm">
								{(session.user as { username?: string }).username ??
									session.user.name}
							</span>
						)}
						<span className="sr-only">
							{session?.user ? "account" : "sign in"}
						</span>
					</Link>
				</TooltipTrigger>
				<TooltipContent>{session?.user ? "account" : "sign in"}</TooltipContent>
			</Tooltip>
		</header>
	);
}
