import {
	FONT_FAMILIES,
	TYPING_SPEED_UNITS,
	type UserConfig,
} from "@type-ninja/shared/config";

/**
 * Single source of truth for every user-facing setting. The settings page and
 * the command palette are both generated from this list.
 */

export type SettingSection =
	| "behavior"
	| "input"
	| "sound"
	| "caret"
	| "appearance"
	| "theme"
	| "hide elements";

export interface SettingOption<V> {
	value: V;
	label: string;
}

interface BaseSetting<K extends keyof UserConfig> {
	key: K;
	title: string;
	description: string;
	section: SettingSection;
}

export interface EnumSetting<K extends keyof UserConfig>
	extends BaseSetting<K> {
	type: "enum";
	options: SettingOption<UserConfig[K]>[];
}

export interface BooleanSetting<K extends keyof UserConfig>
	extends BaseSetting<K> {
	type: "boolean";
}

export interface NumberSetting<K extends keyof UserConfig>
	extends BaseSetting<K> {
	type: "number";
	min: number;
	max: number;
	step: number;
	presets: SettingOption<UserConfig[K]>[];
}

export type SettingDefinition = {
	[K in keyof UserConfig]:
		| EnumSetting<K>
		| BooleanSetting<K>
		| NumberSetting<K>;
}[keyof UserConfig];

const onOff = (
	key: keyof UserConfig,
	title: string,
	description: string,
	section: SettingSection
) =>
	({ key, title, description, section, type: "boolean" }) as SettingDefinition;

export const SETTINGS: SettingDefinition[] = [
	// ── behavior ──────────────────────────────────────────────────────────
	{
		key: "difficulty",
		title: "test difficulty",
		description:
			"Normal is the classic experience. Expert fails the test when you submit an incorrect line. Master fails the test on a single incorrect key press.",
		section: "behavior",
		type: "enum",
		options: [
			{ value: "normal", label: "normal" },
			{ value: "expert", label: "expert" },
			{ value: "master", label: "master" },
		],
	},
	{
		key: "quickRestart",
		title: "quick restart",
		description:
			"Press tab or esc to quickly restart the test with a new snippet, or to quickly jump to the test page. When off, tab focuses the restart button and enter triggers it.",
		section: "behavior",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "tab", label: "tab" },
			{ value: "esc", label: "esc" },
		],
	},
	onOff(
		"blindMode",
		"blind mode",
		"No errors or incorrect characters are highlighted. Helps you to focus on raw speed. If enabled, quick end is recommended.",
		"behavior"
	),
	{
		key: "stopOnError",
		title: "stop on error",
		description:
			"Letter mode will stop input when pressing any incorrect letters. Line mode will not allow you to continue to the next line until you have corrected all mistakes.",
		section: "behavior",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "letter", label: "letter" },
			{ value: "line", label: "line" },
		],
	},
	{
		key: "confidenceMode",
		title: "confidence mode",
		description:
			"When enabled, you will not be able to go back to previous lines to fix mistakes. When turned up to the max, you won't be able to backspace at all.",
		section: "behavior",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "on", label: "on" },
			{ value: "max", label: "max" },
		],
	},
	// ── input ─────────────────────────────────────────────────────────────
	onOff(
		"autoIndent",
		"auto indent",
		"Automatically skip the leading indentation of each line, just like an editor would. Skipped characters never count toward your speed.",
		"input"
	),
	onOff(
		"freedomMode",
		"freedom mode",
		"Allows you to delete any character, including correct ones on previously completed lines.",
		"input"
	),
	// ── sound ─────────────────────────────────────────────────────────────
	{
		key: "soundOnClick",
		title: "play sound on click",
		description: "Plays a short sound when you press a key.",
		section: "sound",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "click", label: "click" },
			{ value: "beep", label: "beep" },
			{ value: "typewriter", label: "typewriter" },
		],
	},
	onOff(
		"soundOnError",
		"play sound on error",
		"Plays a short sound if you press an incorrect key or press enter on an incorrect line.",
		"sound"
	),
	// ── caret ─────────────────────────────────────────────────────────────
	{
		key: "smoothCaret",
		title: "smooth caret",
		description: "The caret will move smoothly between letters and lines.",
		section: "caret",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "slow", label: "slow" },
			{ value: "medium", label: "medium" },
			{ value: "fast", label: "fast" },
		],
	},
	{
		key: "caretStyle",
		title: "caret style",
		description: "Change the style of the caret during the test.",
		section: "caret",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "default", label: "|" },
			{ value: "block", label: "▮" },
			{ value: "outline", label: "▯" },
			{ value: "underline", label: "_" },
		],
	},
	// ── appearance ────────────────────────────────────────────────────────
	onOff(
		"smoothLineScroll",
		"smooth line scroll",
		"When enabled, the line transition will be animated.",
		"appearance"
	),
	onOff(
		"showLineNumbers",
		"line numbers",
		"Show line numbers next to the code, like in an editor.",
		"appearance"
	),
	{
		key: "highlightMode",
		title: "highlight mode",
		description: "Change what is highlighted during the test.",
		section: "appearance",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "letter", label: "letter" },
			{ value: "line", label: "line" },
		],
	},
	{
		key: "fontSize",
		title: "font size",
		description: "Change the font size of the test code.",
		section: "appearance",
		type: "number",
		min: 0.5,
		max: 5,
		step: 0.25,
		presets: [
			{ value: 1, label: "1" },
			{ value: 1.25, label: "1.25" },
			{ value: 1.5, label: "1.5" },
			{ value: 2, label: "2" },
			{ value: 3, label: "3" },
		],
	},
	{
		key: "fontFamily",
		title: "font family",
		description: "Change the font used for the test code.",
		section: "appearance",
		type: "enum",
		options: FONT_FAMILIES.map((value) => ({
			value,
			label: value.replace(/-/g, " "),
		})),
	},
	{
		key: "typingSpeedUnit",
		title: "typing speed unit",
		description:
			"Display typing speed in words per minute, characters per minute, words per hour or characters per hour.",
		section: "appearance",
		type: "enum",
		options: TYPING_SPEED_UNITS.map((value) => ({ value, label: value })),
	},
	onOff(
		"alwaysShowDecimalPlaces",
		"always show decimal places",
		"Always shows decimal places for values on the result page, instead of rounding to the nearest whole number.",
		"appearance"
	),
	// ── theme ─────────────────────────────────────────────────────────────
	onOff(
		"flipTestColors",
		"flip test colors",
		"By default, typed text is brighter than the future text. When enabled, the colors will be flipped and the text you are about to type will be brighter.",
		"theme"
	),
	onOff(
		"colorfulMode",
		"colorful mode",
		"When enabled, the main color will be used for the error colors, instead of the dedicated error color.",
		"theme"
	),
	{
		key: "randomTheme",
		title: "randomize theme",
		description:
			"After each test, the theme will be set to a random one. You can also restrict it to light or dark themes.",
		section: "theme",
		type: "enum",
		options: [
			{ value: "off", label: "off" },
			{ value: "on", label: "on" },
			{ value: "light", label: "light" },
			{ value: "dark", label: "dark" },
		],
	},
	// ── hide elements ─────────────────────────────────────────────────────
	onOff(
		"liveSpeed",
		"live speed",
		"Displays your current typing speed while typing.",
		"hide elements"
	),
	onOff(
		"liveAccuracy",
		"live accuracy",
		"Displays your current accuracy while typing.",
		"hide elements"
	),
	onOff(
		"liveTimer",
		"live timer",
		"Displays the time elapsed while typing.",
		"hide elements"
	),
	onOff(
		"liveProgress",
		"live progress",
		"Displays how many lines you have completed.",
		"hide elements"
	),
	onOff(
		"keyTips",
		"key tips",
		"Shows the keybind tips below the test.",
		"hide elements"
	),
	onOff(
		"outOfFocusWarning",
		"out of focus warning",
		"Shows an out of focus reminder after 1 second of being out of focus (no focus on the test).",
		"hide elements"
	),
	onOff(
		"capsLockWarning",
		"caps lock warning",
		"Displays a warning when caps lock is on.",
		"hide elements"
	),
];

export const SETTING_SECTIONS: SettingSection[] = [
	"behavior",
	"input",
	"sound",
	"caret",
	"appearance",
	"theme",
	"hide elements",
];

export function getSetting(key: string): SettingDefinition | undefined {
	return SETTINGS.find((s) => s.key === key);
}
