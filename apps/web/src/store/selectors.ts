import { useAppStore } from "./app-store";

/**
 * Atomic selector hooks.
 *
 * Each hook selects exactly ONE piece of state so components only
 * re-render when that specific value changes. This is the recommended
 * Zustand pattern to avoid unnecessary renders:
 *
 *   const sidebarOpen = useSidebarOpen();        // ✅ only re-renders on change
 *   const { sidebarOpen } = useAppStore();       // ❌ re-renders on ANY state change
 *
 * Group selectors by slice for discoverability.
 */

// ─── UI Selectors ───────────────────────────────────────────────────────────

export const useSidebarOpen = () => useAppStore((s) => s.sidebarOpen);
export const useToggleSidebar = () => useAppStore((s) => s.toggleSidebar);
export const useSetSidebarOpen = () => useAppStore((s) => s.setSidebarOpen);
