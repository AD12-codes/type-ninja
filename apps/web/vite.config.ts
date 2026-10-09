import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
	plugins: [tailwindcss(), tanstackRouter({}), react()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	define: {
		"import.meta.env.APP_VERSION": JSON.stringify(pkg.version),
	},
	server: {
		port: 9898,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					mermaid: ["mermaid"],
					charts: ["recharts"],
				},
			},
		},
	},
	test: {
		environment: "jsdom",
		environmentOptions: { jsdom: { url: "http://localhost" } },
		globals: true,
		setupFiles: ["./src/test-setup.ts"],
	},
});
