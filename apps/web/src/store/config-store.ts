import {
	DEFAULT_CONFIG,
	parseConfig,
	type UserConfig,
} from "@type-ninja/shared/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConfigState {
	config: UserConfig;
	/** Last time the config changed locally (ms epoch). */
	updatedAt: number;
	setConfig: <K extends keyof UserConfig>(key: K, value: UserConfig[K]) => void;
	replaceConfig: (config: UserConfig, updatedAt?: number) => void;
	resetConfig: () => void;
}

export const useConfigStore = create<ConfigState>()(
	persist(
		(set) => ({
			config: DEFAULT_CONFIG,
			updatedAt: 0,
			setConfig: (key, value) =>
				set((state) => ({
					config: { ...state.config, [key]: value },
					updatedAt: Date.now(),
				})),
			replaceConfig: (config, updatedAt) =>
				set({
					config: parseConfig(config),
					updatedAt: updatedAt ?? Date.now(),
				}),
			resetConfig: () =>
				set({ config: { ...DEFAULT_CONFIG }, updatedAt: Date.now() }),
		}),
		{
			name: "typeninja-config",
			partialize: (state) => ({
				config: state.config,
				updatedAt: state.updatedAt,
			}),
			merge: (persisted, current) => {
				const saved = persisted as Partial<ConfigState> | undefined;
				return {
					...current,
					config: parseConfig(saved?.config),
					updatedAt: saved?.updatedAt ?? 0,
				};
			},
		}
	)
);

export const useConfig = () => useConfigStore((s) => s.config);
export const useSetConfig = () => useConfigStore((s) => s.setConfig);
