import { describe, expect, it } from "vitest";
import {
	convertSpeed,
	formatDuration,
	formatPercent,
	formatSpeed,
} from "../format";

describe("format helpers", () => {
	it("formats durations as m:ss and h:mm:ss", () => {
		expect(formatDuration(65_000)).toBe("1:05");
		expect(formatDuration(3_725_000)).toBe("1:02:05");
	});

	it("converts wpm into other units", () => {
		expect(convertSpeed(60, "wpm")).toBe(60);
		expect(convertSpeed(60, "cpm")).toBe(300);
		expect(convertSpeed(60, "wph")).toBe(3600);
		expect(convertSpeed(60, "cph")).toBe(18_000);
	});

	it("rounds unless decimals are requested", () => {
		expect(
			formatSpeed(72.46, {
				typingSpeedUnit: "wpm",
				alwaysShowDecimalPlaces: false,
			})
		).toBe("72");
		expect(
			formatSpeed(72.46, {
				typingSpeedUnit: "wpm",
				alwaysShowDecimalPlaces: true,
			})
		).toBe("72.46");
		expect(formatPercent(97.56, { alwaysShowDecimalPlaces: false })).toBe(
			"98%"
		);
	});
});
