import { create } from "zustand";

export type PaletteView =
	| { type: "root" }
	| { type: "setting"; key: string }
	| { type: "theme" }
	| { type: "language" }
	| { type: "algorithm" };

interface UIState {
	paletteOpen: boolean;
	paletteView: PaletteView;
	openPalette: (view?: PaletteView) => void;
	closePalette: () => void;
	setPaletteView: (view: PaletteView) => void;
	explainOpen: boolean;
	setExplainOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
	paletteOpen: false,
	paletteView: { type: "root" },
	openPalette: (view) =>
		set({ paletteOpen: true, paletteView: view ?? { type: "root" } }),
	closePalette: () =>
		set({ paletteOpen: false, paletteView: { type: "root" } }),
	setPaletteView: (view) => set({ paletteView: view }),
	explainOpen: false,
	setExplainOpen: (open) => set({ explainOpen: open }),
}));
