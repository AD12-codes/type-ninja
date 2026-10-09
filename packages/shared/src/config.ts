import { CATEGORIES, LANGUAGE_IDS } from "@type-ninja/algorithms";
import { z } from "zod";

/**
 * User configuration. This mirrors monkeytype's config object: it is kept in
 * localStorage for everyone and synced to the server for signed-in users.
 */

export const FONT_FAMILIES = [
	"geist-mono",
	"jetbrains-mono",
	"fira-code",
	"roboto-mono",
] as const;

export const TYPING_SPEED_UNITS = ["wpm", "cpm", "wph", "cph"] as const;

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export const MIN_FONT_SIZE = 0.5;
export const MAX_FONT_SIZE = 5;
export const DEFAULT_THEME = "bushido";

export const UserConfigSchema = z.object({
	// ── test ──────────────────────────────────────────────────────────────
	language: z.enum(LANGUAGE_IDS as [string, ...string[]]).default("python"),
	category: z
		.enum(["all", ...CATEGORY_IDS] as [string, ...string[]])
		.default("all"),
	/** `random` or a specific algorithm slug. */
	algorithm: z.string().default("random"),
	difficulty: z.enum(["normal", "expert", "master"]).default("normal"),
	// ── behaviour ─────────────────────────────────────────────────────────
	quickRestart: z.enum(["off", "tab", "esc"]).default("tab"),
	stopOnError: z.enum(["off", "letter", "line"]).default("off"),
	autoIndent: z.boolean().default(true),
	blindMode: z.boolean().default(false),
	freedomMode: z.boolean().default(false),
	confidenceMode: z.enum(["off", "on", "max"]).default("off"),
	// ── sound ─────────────────────────────────────────────────────────────
	soundOnClick: z.enum(["off", "click", "beep", "typewriter"]).default("off"),
	soundOnError: z.boolean().default(false),
	// ── caret ─────────────────────────────────────────────────────────────
	caretStyle: z
		.enum(["off", "default", "block", "outline", "underline"])
		.default("default"),
	smoothCaret: z.enum(["off", "slow", "medium", "fast"]).default("medium"),
	// ── appearance ────────────────────────────────────────────────────────
	smoothLineScroll: z.boolean().default(true),
	showLineNumbers: z.boolean().default(false),
	fontSize: z.number().min(MIN_FONT_SIZE).max(MAX_FONT_SIZE).default(1.5),
	fontFamily: z.enum(FONT_FAMILIES).default("geist-mono"),
	typingSpeedUnit: z.enum(TYPING_SPEED_UNITS).default("wpm"),
	alwaysShowDecimalPlaces: z.boolean().default(false),
	highlightMode: z.enum(["off", "letter", "line"]).default("letter"),
	// ── theme ─────────────────────────────────────────────────────────────
	theme: z.string().default(DEFAULT_THEME),
	randomTheme: z.enum(["off", "on", "light", "dark"]).default("off"),
	flipTestColors: z.boolean().default(false),
	colorfulMode: z.boolean().default(false),
	// ── hide elements ─────────────────────────────────────────────────────
	liveSpeed: z.boolean().default(true),
	liveAccuracy: z.boolean().default(false),
	liveTimer: z.boolean().default(true),
	liveProgress: z.boolean().default(true),
	keyTips: z.boolean().default(true),
	outOfFocusWarning: z.boolean().default(true),
	capsLockWarning: z.boolean().default(true),
});

export type UserConfig = z.infer<typeof UserConfigSchema>;

export const DEFAULT_CONFIG: UserConfig = UserConfigSchema.parse({});

/** Parse an unknown value into a config, falling back to defaults per key. */
export function parseConfig(value: unknown): UserConfig {
	const result = UserConfigSchema.safeParse(value);
	if (result.success) {
		return result.data;
	}
	if (typeof value !== "object" || value === null) {
		return { ...DEFAULT_CONFIG };
	}
	const partial: Record<string, unknown> = {};
	const shape = UserConfigSchema.shape;
	for (const [key, schema] of Object.entries(shape)) {
		const candidate = (value as Record<string, unknown>)[key];
		const parsed = schema.safeParse(candidate);
		partial[key] = parsed.success
			? parsed.data
			: DEFAULT_CONFIG[key as keyof UserConfig];
	}
	return partial as UserConfig;
}
