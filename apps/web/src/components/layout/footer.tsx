import {
	IconBrandGithub,
	IconCode,
	IconMail,
	IconPalette,
	IconTerminal2,
} from "@tabler/icons-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { formatThemeName } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config-store";
import { useTestStore } from "@/store/test-store";
import { useUIStore } from "@/store/ui-store";

const REPO_URL = "https://github.com/AD12-codes/type-ninja";

export function Footer() {
	const theme = useConfigStore((s) => s.config.theme);
	const openPalette = useUIStore((s) => s.openPalette);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const running = useTestStore(
		(s) => s.phase === "typing" && s.test?.status === "running"
	);
	const hide = running && pathname === "/";

	return (
		<footer
			className={cn(
				"flex flex-wrap items-end justify-between gap-4 py-6 text-sub text-xs transition-opacity duration-200",
				hide && "pointer-events-none opacity-0"
			)}
		>
			<div className="flex flex-wrap items-center gap-4">
				<button
					className="flex items-center gap-1 hover:text-text"
					onClick={() => openPalette()}
					type="button"
				>
					<IconTerminal2 className="size-3.5" /> command line
				</button>
				<Link className="flex items-center gap-1 hover:text-text" to="/contact">
					<IconMail className="size-3.5" /> contact
				</Link>
				<a
					className="flex items-center gap-1 hover:text-text"
					href={REPO_URL}
					rel="noopener noreferrer"
					target="_blank"
				>
					<IconBrandGithub className="size-3.5" /> github
				</a>
				<Link className="hover:text-text" to="/terms-of-service">
					terms
				</Link>
				<Link className="hover:text-text" to="/security-policy">
					security
				</Link>
				<Link className="hover:text-text" to="/privacy-policy">
					privacy
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<button
					className="flex items-center gap-1 hover:text-text"
					onClick={() => openPalette({ type: "theme" })}
					type="button"
				>
					<IconPalette className="size-3.5" /> {formatThemeName(theme)}
				</button>
				<span className="flex items-center gap-1">
					<IconCode className="size-3.5" /> v{import.meta.env.APP_VERSION}
				</span>
			</div>
		</footer>
	);
}
