import { isLightTheme, THEME_NAMES, THEMES, type Theme } from "@/themes/themes";

const VARIABLES: Record<keyof Theme, string> = {
	bg: "--bg-color",
	main: "--main-color",
	caret: "--caret-color",
	sub: "--sub-color",
	subAlt: "--sub-alt-color",
	text: "--text-color",
	error: "--error-color",
	errorExtra: "--error-extra-color",
	colorfulError: "--colorful-error-color",
	colorfulErrorExtra: "--colorful-error-extra-color",
};

export function getTheme(name: string): Theme {
	return THEMES[name] ?? (THEMES.bushido as Theme);
}

export function applyTheme(name: string) {
	const theme = getTheme(name);
	const root = document.documentElement;
	for (const [key, variable] of Object.entries(VARIABLES)) {
		root.style.setProperty(variable, theme[key as keyof Theme]);
	}
	root.style.colorScheme = isLightTheme(theme) ? "light" : "dark";
	root.dataset.theme = name;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute("content", theme.bg);
	}
}

export function randomThemeName(
	mode: "on" | "light" | "dark",
	exclude?: string
): string {
	const pool = THEME_NAMES.filter((name) => {
		if (name === exclude) {
			return false;
		}
		if (mode === "on") {
			return true;
		}
		const light = isLightTheme(getTheme(name));
		return mode === "light" ? light : !light;
	});
	return pool[Math.floor(Math.random() * pool.length)] ?? "bushido";
}

export function formatThemeName(name: string): string {
	return name.replace(/_/g, " ");
}
