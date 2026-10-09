import { createFileRoute } from "@tanstack/react-router";
import { AccountSettings } from "@/components/settings/account-settings";
import {
	OptionButton,
	SettingGroup,
} from "@/components/settings/setting-group";
import { SETTING_SECTIONS, SETTINGS } from "@/lib/settings";
import { formatThemeName } from "@/lib/theme";
import { useConfigStore } from "@/store/config-store";
import { useUIStore } from "@/store/ui-store";
import { THEME_NAMES, THEMES } from "@/themes/themes";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function ThemePicker() {
	const theme = useConfigStore((s) => s.config.theme);
	const setConfig = useConfigStore((s) => s.setConfig);
	return (
		<div className="grid gap-2" id="theme">
			<div>
				<h3 className="text-lg text-text">theme</h3>
				<p className="text-sm text-sub">
					Pick a colour scheme. Hover a theme in the command line to preview it.
				</p>
			</div>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
				{THEME_NAMES.map((name) => {
					const colors = THEMES[name];
					if (!colors) {
						return null;
					}
					return (
						<button
							className="flex items-center justify-between rounded-md px-3 py-2 text-sm outline-none ring-main transition-shadow hover:ring-2 focus-visible:ring-2"
							key={name}
							onClick={() => setConfig("theme", name)}
							style={{
								background: colors.bg,
								color: colors.text,
								boxShadow:
									theme === name ? `0 0 0 2px ${colors.main}` : undefined,
							}}
							type="button"
						>
							<span style={{ color: colors.main }}>
								{formatThemeName(name)}
							</span>
							<span className="flex gap-1">
								<span
									className="size-3 rounded-full"
									style={{ background: colors.main }}
								/>
								<span
									className="size-3 rounded-full"
									style={{ background: colors.sub }}
								/>
								<span
									className="size-3 rounded-full"
									style={{ background: colors.text }}
								/>
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function SettingsPage() {
	const openPalette = useUIStore((s) => s.openPalette);
	const sections = [...SETTING_SECTIONS, "danger zone"] as const;

	return (
		<div className="flex flex-col gap-10 py-4">
			<nav className="flex flex-wrap gap-2">
				{sections.map((section) => (
					<a href={`#${section.replace(" ", "-")}`} key={section}>
						<OptionButton active={false} onClick={() => undefined}>
							{section}
						</OptionButton>
					</a>
				))}
				<OptionButton active={false} onClick={() => openPalette()}>
					command line
				</OptionButton>
			</nav>

			{SETTING_SECTIONS.map((section) => (
				<section
					className="flex flex-col gap-6"
					id={section.replace(" ", "-")}
					key={section}
				>
					<h2 className="font-semibold text-2xl text-main">{section}</h2>
					{section === "theme" && <ThemePicker />}
					{SETTINGS.filter((s) => s.section === section).map((setting) => (
						<SettingGroup key={setting.key} setting={setting} />
					))}
				</section>
			))}

			<section className="flex flex-col gap-6" id="danger-zone">
				<h2 className="font-semibold text-2xl text-error">danger zone</h2>
				<AccountSettings />
			</section>
		</div>
	);
}
