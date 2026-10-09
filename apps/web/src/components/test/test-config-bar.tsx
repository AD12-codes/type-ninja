import { IconChevronDown } from "@tabler/icons-react";
import { CATEGORIES } from "@type-ninja/algorithms";
import type { UserConfig } from "@type-ninja/shared/config";
import { useAlgorithms, useLanguages } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";

const DIFFICULTIES: UserConfig["difficulty"][] = ["normal", "expert", "master"];

function BarButton({
	active,
	onClick,
	children,
	chevron,
}: {
	active?: boolean;
	onClick: () => void;
	children: React.ReactNode;
	chevron?: boolean;
}) {
	return (
		<button
			className={cn(
				"flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors hover:text-text",
				active ? "text-main" : "text-sub"
			)}
			onClick={onClick}
			type="button"
		>
			{children}
			{chevron && <IconChevronDown className="size-3" />}
		</button>
	);
}

function Divider() {
	return <div className="mx-1 h-5 w-1 rounded bg-bg" />;
}

export function TestConfigBar() {
	const config = useConfigStore((s) => s.config);
	const setConfig = useConfigStore((s) => s.setConfig);
	const openPalette = useUIStore((s) => s.openPalette);
	const languages = useLanguages();
	const algorithms = useAlgorithms();

	const languageName =
		languages.data?.languages.find((l) => l.id === config.language)?.name ??
		config.language;
	const algorithmName =
		config.algorithm === "random"
			? "random algorithm"
			: (algorithms.data?.algorithms.find((a) => a.slug === config.algorithm)
					?.name ?? config.algorithm);
	const categoryName =
		config.category === "all"
			? "all categories"
			: (CATEGORIES.find((c) => c.id === config.category)?.name.toLowerCase() ??
				config.category);

	return (
		<div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-1 rounded-lg bg-sub-alt px-2 py-1">
			<BarButton
				active
				chevron
				onClick={() => openPalette({ type: "language" })}
			>
				{languageName.toLowerCase()}
			</BarButton>
			<Divider />
			<BarButton
				active={config.category !== "all"}
				chevron
				onClick={() => openPalette({ type: "setting", key: "category" })}
			>
				{categoryName}
			</BarButton>
			<BarButton
				active={config.algorithm !== "random"}
				chevron
				onClick={() => openPalette({ type: "algorithm" })}
			>
				{algorithmName.toLowerCase()}
			</BarButton>
			<Divider />
			{DIFFICULTIES.map((difficulty) => (
				<BarButton
					active={config.difficulty === difficulty}
					key={difficulty}
					onClick={() => setConfig("difficulty", difficulty)}
				>
					{difficulty}
				</BarButton>
			))}
		</div>
	);
}
