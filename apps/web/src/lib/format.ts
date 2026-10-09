import type { UserConfig } from "@type-ninja/shared/config";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const MS_PER_SECOND = 1000;
const CHARS_PER_WORD = 5;

export function formatDuration(ms: number): string {
	const totalSeconds = Math.round(ms / MS_PER_SECOND);
	const hours = Math.floor(
		totalSeconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR)
	);
	const minutes = Math.floor(
		(totalSeconds / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR
	);
	const seconds = totalSeconds % SECONDS_PER_MINUTE;
	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}
	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatSeconds(ms: number, decimals = 1): string {
	return `${(ms / MS_PER_SECOND).toFixed(decimals)}s`;
}

/** Converts a wpm value into the user's preferred unit. */
export function convertSpeed(
	wpm: number,
	unit: UserConfig["typingSpeedUnit"]
): number {
	switch (unit) {
		case "cpm":
			return wpm * CHARS_PER_WORD;
		case "wph":
			return wpm * MINUTES_PER_HOUR;
		case "cph":
			return wpm * CHARS_PER_WORD * MINUTES_PER_HOUR;
		default:
			return wpm;
	}
}

export function formatSpeed(
	wpm: number,
	config: Pick<UserConfig, "typingSpeedUnit" | "alwaysShowDecimalPlaces">
): string {
	const value = convertSpeed(wpm, config.typingSpeedUnit);
	return config.alwaysShowDecimalPlaces
		? value.toFixed(2)
		: String(Math.round(value));
}

export function formatPercent(
	value: number,
	config: Pick<UserConfig, "alwaysShowDecimalPlaces">
): string {
	return `${config.alwaysShowDecimalPlaces ? value.toFixed(2) : Math.round(value)}%`;
}

export function formatDate(iso: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(iso));
}

export function formatRelativeDays(ms: number): string {
	const DAY = 86_400_000;
	const days = Math.floor(ms / DAY);
	if (days <= 0) {
		return "today";
	}
	return days === 1 ? "1 day ago" : `${days} days ago`;
}
