import { DEFAULT_CONFIG } from "@type-ninja/shared/config";
import { beforeEach, describe, expect, it } from "vitest";
import { useConfigStore } from "../config-store";

describe("config store", () => {
	beforeEach(() => {
		useConfigStore.getState().resetConfig();
	});

	it("starts with defaults", () => {
		expect(useConfigStore.getState().config.theme).toBe(DEFAULT_CONFIG.theme);
		expect(useConfigStore.getState().config.language).toBe("python");
	});

	it("updates a single key and bumps updatedAt", () => {
		const before = useConfigStore.getState().updatedAt;
		useConfigStore.getState().setConfig("language", "go");
		expect(useConfigStore.getState().config.language).toBe("go");
		expect(useConfigStore.getState().updatedAt).toBeGreaterThanOrEqual(before);
	});

	it("falls back to defaults for invalid values when replacing", () => {
		useConfigStore
			.getState()
			.replaceConfig({ ...DEFAULT_CONFIG, fontSize: 99 });
		expect(useConfigStore.getState().config.fontSize).toBe(
			DEFAULT_CONFIG.fontSize
		);
	});
});
