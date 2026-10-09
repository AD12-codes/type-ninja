import "@testing-library/jest-dom/vitest";

/**
 * When vitest runs under Bun, Bun's own `localStorage` global shadows jsdom's
 * and lacks the Web Storage methods. Install a small in-memory implementation
 * so persisted stores work in tests.
 */
function createMemoryStorage(): Storage {
	const data = new Map<string, string>();
	return {
		get length() {
			return data.size;
		},
		clear: () => data.clear(),
		getItem: (key) => data.get(key) ?? null,
		key: (index) => Array.from(data.keys())[index] ?? null,
		removeItem: (key) => {
			data.delete(key);
		},
		setItem: (key, value) => {
			data.set(key, String(value));
		},
	};
}

const storage = globalThis.localStorage as Partial<Storage> | undefined;
if (!storage || typeof storage.setItem !== "function") {
	Object.defineProperty(globalThis, "localStorage", {
		value: createMemoryStorage(),
		configurable: true,
	});
}
