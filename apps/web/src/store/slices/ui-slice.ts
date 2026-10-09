import type { StateCreator } from "zustand";

/**
 * UI Slice — manages ephemeral UI state (sidebar, modals, toasts, etc.).
 *
 * Keeping UI state in Zustand instead of prop-drilling or context avoids
 * unnecessary re-renders and makes the state accessible from anywhere.
 */

export interface UISlice {
	/** Whether the sidebar / nav drawer is expanded. */
	sidebarOpen: boolean;
	/** Toggle sidebar open/closed. */
	toggleSidebar: () => void;
	/** Explicitly set sidebar state. */
	setSidebarOpen: (open: boolean) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
	sidebarOpen: false,
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
	setSidebarOpen: (open) => set({ sidebarOpen: open }),
});
