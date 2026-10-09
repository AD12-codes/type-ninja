import { useEffect } from "react";
import { applyTheme } from "@/lib/theme";
import { useConfigStore } from "@/store/config-store";

const FONT_VARS: Record<string, string> = {
	"geist-mono": "var(--font-geist)",
	"jetbrains-mono": "var(--font-jetbrains)",
	"fira-code": "var(--font-fira)",
	"roboto-mono": "var(--font-roboto)",
};

/** Applies theme, font family and font size from the config to the document. */
export function useApplyAppearance() {
	const theme = useConfigStore((s) => s.config.theme);
	const fontFamily = useConfigStore((s) => s.config.fontFamily);
	const fontSize = useConfigStore((s) => s.config.fontSize);

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	useEffect(() => {
		const root = document.documentElement;
		root.style.setProperty(
			"--test-font",
			FONT_VARS[fontFamily] ?? FONT_VARS["geist-mono"] ?? ""
		);
		root.style.setProperty("--test-font-size", `${fontSize}rem`);
	}, [fontFamily, fontSize]);
}
