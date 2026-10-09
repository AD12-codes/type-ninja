import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		/**
		 * Base URL of the API. Leave empty in production when the API serves the
		 * web build from the same origin.
		 */
		VITE_SERVER_URL: z.url().optional(),
	},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
