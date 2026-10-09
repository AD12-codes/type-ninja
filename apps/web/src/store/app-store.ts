/**
 * Root Zustand store — production-grade setup.
 *
 * Architecture:
 * - Slice pattern: each domain (UI, auth, etc.) is an independent slice.
 * - Devtools middleware: enabled only in development for zero production overhead.
 * - Atomic selectors: use `@/store/selectors` for fine-grained subscriptions.
 *
 * Import paths:
 *   import { useAppStore } from "@/store/app-store";
 *   import { useSidebarOpen } from "@/store/selectors";
 *
 * To add a new slice:
 * 1. Create `@/store/slices/<name>.ts` exporting the slice creator.
 * 2. Compose it into `AppState` and the store below.
 * 3. Export atomic selector hooks from `@/store/selectors`.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createUISlice, type UISlice } from "./slices/ui-slice";

/**
 * Aggregate application state.
 *
 * As the app grows, intersect additional slice interfaces here
 * (e.g. `AppState = UISlice & AuthSlice & GridSlice`).
 */
export type AppState = UISlice;

/**
 * Root Zustand store.
 *
 * - `devtools` middleware is enabled only in development (tree-shaken in prod).
 * - Each slice is spread into the store via its creator function.
 * - `name` helps identify the store in Redux DevTools / Zustand DevTools.
 */
export const useAppStore = create<AppState>()(
	devtools(
		(...args) => ({
			...createUISlice(...args),
			// Compose additional slices here:
			// ...createAuthSlice(...args),
			// ...createGridSlice(...args),
		}),
		{
			name: "ad-stack",
			enabled: import.meta.env.DEV,
		}
	)
);
