import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { CATEGORIES } from "@type-ninja/algorithms";
import type { UserConfig } from "@type-ninja/shared/config";
import { useEffect, useMemo, useRef } from "react";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { signOut, useSession } from "@/lib/auth-client";
import { useAlgorithms, useLanguages } from "@/lib/queries";
import { getSetting, SETTINGS, type SettingDefinition } from "@/lib/settings";
import { applyTheme, formatThemeName, randomThemeName } from "@/lib/theme";
import { useConfigStore } from "@/store/config-store";
import { type PaletteView, useUIStore } from "@/store/ui-store";
import { THEME_NAMES } from "@/themes/themes";

type Choose = <K extends keyof UserConfig>(
	key: K,
	value: UserConfig[K]
) => void;

function optionLabel(setting: SettingDefinition, value: unknown): string {
	if (setting.type === "boolean") {
		return value ? "on" : "off";
	}
	if (setting.type === "enum") {
		return (
			setting.options.find((o) => o.value === value)?.label ?? String(value)
		);
	}
	return String(value);
}

function ActiveMark({ active }: { active: boolean }) {
	return active ? <span className="text-main text-xs">active</span> : null;
}

function ThemeView({
	config,
	choose,
	preview,
	restore,
}: {
	config: UserConfig;
	choose: Choose;
	preview: (name: string) => void;
	restore: () => void;
}) {
	return (
		<CommandGroup heading="themes">
			{THEME_NAMES.map((name) => (
				<CommandItem
					key={name}
					onMouseEnter={() => preview(name)}
					onMouseLeave={restore}
					onSelect={() => choose("theme", name)}
					value={name}
				>
					<span className="flex-1">{formatThemeName(name)}</span>
					<ActiveMark active={config.theme === name} />
				</CommandItem>
			))}
		</CommandGroup>
	);
}

function LanguageView({
	config,
	choose,
}: {
	config: UserConfig;
	choose: Choose;
}) {
	const languages = useLanguages();
	return (
		<CommandGroup heading="languages">
			{(languages.data?.languages ?? []).map((language) => (
				<CommandItem
					key={language.id}
					onSelect={() => choose("language", language.id)}
					value={language.name}
				>
					<span className="flex-1">{language.name.toLowerCase()}</span>
					<ActiveMark active={config.language === language.id} />
				</CommandItem>
			))}
		</CommandGroup>
	);
}

function AlgorithmView({
	config,
	choose,
}: {
	config: UserConfig;
	choose: Choose;
}) {
	const algorithms = useAlgorithms();
	return (
		<>
			<CommandGroup>
				<CommandItem
					onSelect={() => choose("algorithm", "random")}
					value="random algorithm"
				>
					<span className="flex-1">random algorithm</span>
					<ActiveMark active={config.algorithm === "random"} />
				</CommandItem>
			</CommandGroup>
			{CATEGORIES.map((category) => (
				<CommandGroup heading={category.name.toLowerCase()} key={category.id}>
					{(algorithms.data?.algorithms ?? [])
						.filter((a) => a.category === category.id)
						.map((algorithm) => (
							<CommandItem
								key={algorithm.slug}
								onSelect={() => choose("algorithm", algorithm.slug)}
								value={`${algorithm.name} ${algorithm.category}`}
							>
								<span className="flex-1">{algorithm.name.toLowerCase()}</span>
								<span className="text-sub text-xs">{algorithm.difficulty}</span>
							</CommandItem>
						))}
				</CommandGroup>
			))}
		</>
	);
}

function CategoryView({ choose }: { choose: Choose }) {
	return (
		<CommandGroup heading="category">
			<CommandItem
				onSelect={() => choose("category", "all")}
				value="all categories"
			>
				all categories
			</CommandItem>
			{CATEGORIES.map((category) => (
				<CommandItem
					key={category.id}
					onSelect={() => choose("category", category.id)}
					value={category.name}
				>
					{category.name.toLowerCase()}
				</CommandItem>
			))}
		</CommandGroup>
	);
}

function settingOptions(
	setting: SettingDefinition
): { value: unknown; label: string }[] {
	if (setting.type === "boolean") {
		return [
			{ value: true, label: "on" },
			{ value: false, label: "off" },
		];
	}
	if (setting.type === "number") {
		return setting.presets;
	}
	return setting.options;
}

function SettingView({
	settingKey,
	config,
	choose,
}: {
	settingKey: string;
	config: UserConfig;
	choose: Choose;
}) {
	if (settingKey === "category") {
		return <CategoryView choose={choose} />;
	}
	const setting = getSetting(settingKey);
	if (!setting) {
		return <CommandEmpty>unknown setting</CommandEmpty>;
	}
	const options = settingOptions(setting);
	return (
		<CommandGroup heading={setting.title}>
			{options.map((option) => (
				<CommandItem
					key={String(option.value)}
					onSelect={() => choose(setting.key, option.value as never)}
					value={option.label}
				>
					<span className="flex-1">{option.label}</span>
					<ActiveMark active={config[setting.key] === option.value} />
				</CommandItem>
			))}
		</CommandGroup>
	);
}

function RootView({
	config,
	choose,
	setView,
	close,
}: {
	config: UserConfig;
	choose: Choose;
	setView: (view: PaletteView) => void;
	close: () => void;
}) {
	const navigate = useNavigate();
	const { data: session } = useSession();
	const pages = [
		{ to: "/", label: "typing test" },
		{ to: "/algorithms", label: "algorithms" },
		{ to: "/leaderboards", label: "leaderboards" },
		{ to: "/settings", label: "settings" },
		{ to: "/about", label: "about" },
		{
			to: session?.user ? "/account" : "/login",
			label: session?.user ? "account" : "sign in",
		},
	];
	return (
		<>
			<CommandGroup heading="test">
				<CommandItem
					onSelect={() => setView({ type: "language" })}
					value="change language"
				>
					<span className="flex-1">language</span>
					<span className="text-sub text-xs">{config.language}</span>
				</CommandItem>
				<CommandItem
					onSelect={() => setView({ type: "algorithm" })}
					value="change algorithm"
				>
					<span className="flex-1">algorithm</span>
					<span className="text-sub text-xs">{config.algorithm}</span>
				</CommandItem>
				<CommandItem
					onSelect={() => setView({ type: "setting", key: "category" })}
					value="change category"
				>
					<span className="flex-1">category</span>
					<span className="text-sub text-xs">{config.category}</span>
				</CommandItem>
			</CommandGroup>
			<CommandGroup heading="theme">
				<CommandItem
					onSelect={() => setView({ type: "theme" })}
					value="change theme"
				>
					<span className="flex-1">theme</span>
					<span className="text-sub text-xs">
						{formatThemeName(config.theme)}
					</span>
				</CommandItem>
				<CommandItem
					onSelect={() => choose("theme", randomThemeName("on", config.theme))}
					value="random theme"
				>
					random theme
				</CommandItem>
			</CommandGroup>
			<CommandGroup heading="settings">
				{SETTINGS.map((setting) => (
					<CommandItem
						key={setting.key}
						onSelect={() => setView({ type: "setting", key: setting.key })}
						value={`${setting.title} ${setting.section}`}
					>
						<span className="flex-1">{setting.title}</span>
						<span className="text-sub text-xs">
							{optionLabel(setting, config[setting.key])}
						</span>
					</CommandItem>
				))}
			</CommandGroup>
			<CommandGroup heading="navigate">
				{pages.map((item) => (
					<CommandItem
						key={item.to}
						onSelect={() => {
							close();
							navigate({ to: item.to });
						}}
						value={`go to ${item.label}`}
					>
						{item.label}
					</CommandItem>
				))}
				{session?.user && (
					<CommandItem
						onSelect={async () => {
							close();
							await signOut();
							navigate({ to: "/" });
						}}
						value="sign out"
					>
						sign out
					</CommandItem>
				)}
			</CommandGroup>
		</>
	);
}

function PaletteBody({
	view,
	config,
	choose,
	setView,
	close,
	preview,
	restore,
}: {
	view: PaletteView;
	config: UserConfig;
	choose: Choose;
	setView: (view: PaletteView) => void;
	close: () => void;
	preview: (name: string) => void;
	restore: () => void;
}) {
	switch (view.type) {
		case "theme":
			return (
				<ThemeView
					choose={choose}
					config={config}
					preview={preview}
					restore={restore}
				/>
			);
		case "language":
			return <LanguageView choose={choose} config={config} />;
		case "algorithm":
			return <AlgorithmView choose={choose} config={config} />;
		case "setting":
			return (
				<SettingView choose={choose} config={config} settingKey={view.key} />
			);
		default:
			return (
				<RootView
					choose={choose}
					close={close}
					config={config}
					setView={setView}
				/>
			);
	}
}

function viewHeading(view: PaletteView): string | null {
	switch (view.type) {
		case "theme":
		case "language":
		case "algorithm":
			return view.type;
		case "setting":
			return getSetting(view.key)?.title ?? view.key;
		default:
			return null;
	}
}

export function CommandPalette() {
	const open = useUIStore((s) => s.paletteOpen);
	const view = useUIStore((s) => s.paletteView);
	const openPalette = useUIStore((s) => s.openPalette);
	const closePalette = useUIStore((s) => s.closePalette);
	const setView = useUIStore((s) => s.setPaletteView);
	const config = useConfigStore((s) => s.config);
	const setConfig = useConfigStore((s) => s.setConfig);
	const previewing = useRef(false);

	// Global shortcut: ctrl/cmd + shift + p
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (
				(event.ctrlKey || event.metaKey) &&
				event.shiftKey &&
				event.key.toLowerCase() === "p"
			) {
				event.preventDefault();
				if (open) {
					closePalette();
				} else {
					openPalette();
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [open, openPalette, closePalette]);

	const restore = () => {
		if (previewing.current) {
			applyTheme(config.theme);
			previewing.current = false;
		}
	};
	const preview = (name: string) => {
		previewing.current = true;
		applyTheme(name);
	};
	const close = () => {
		restore();
		closePalette();
	};
	const choose: Choose = (key, value) => {
		previewing.current = false;
		setConfig(key, value);
		closePalette();
	};

	const heading = useMemo(() => viewHeading(view), [view]);

	return (
		<CommandDialog
			onOpenChange={(next) => {
				if (!next) {
					close();
				}
			}}
			open={open}
			title="command line"
		>
			<Command
				onKeyDown={(event) => {
					const input = event.target as HTMLInputElement;
					if (
						event.key === "Backspace" &&
						view.type !== "root" &&
						input.value === ""
					) {
						event.preventDefault();
						setView({ type: "root" });
					}
				}}
			>
				<div className="flex items-center">
					{view.type !== "root" && (
						<button
							aria-label="back"
							className="ml-2 rounded p-1 text-sub hover:text-text"
							onClick={() => setView({ type: "root" })}
							type="button"
						>
							<IconArrowLeft className="size-4" />
						</button>
					)}
					<CommandInput
						className="flex-1"
						placeholder={heading ? `${heading}…` : "type a command or search…"}
					/>
				</div>
				<CommandList className="max-h-[60vh]">
					<CommandEmpty>no results</CommandEmpty>
					<PaletteBody
						choose={choose}
						close={close}
						config={config}
						preview={preview}
						restore={restore}
						setView={setView}
						view={view}
					/>
				</CommandList>
			</Command>
		</CommandDialog>
	);
}
