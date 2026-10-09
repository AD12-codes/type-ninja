import { initializeAuth } from "@type-ninja/auth";
import { logger } from "@type-ninja/core/logger";
import { closeDB, initializeDB } from "@type-ninja/db";
import { runMigrations } from "@type-ninja/db/migrate";
import { seedContent } from "@type-ninja/db/seed";
import { env } from "@type-ninja/env/server";
import { serve } from "bun";
import { app, mountStaticWeb } from "./app";

async function bootstrap() {
	logger.info("initializing services");
	await initializeDB();
	if (env.RUN_MIGRATIONS_ON_START) {
		await runMigrations();
	}
	if (env.SEED_ON_START) {
		await seedContent();
	}
	initializeAuth();
	if (env.WEB_DIST_DIR) {
		mountStaticWeb(env.WEB_DIST_DIR);
	}

	const server = serve({ fetch: app.fetch, port: env.PORT });
	logger.info({ port: env.PORT, env: env.NODE_ENV }, "server started");
	return server;
}

const server = await bootstrap();

async function shutdown(signal: string) {
	logger.info({ signal }, "shutting down");
	server.stop();
	await closeDB();
	process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (error) => {
	logger.fatal({ error }, "uncaught exception");
	process.exit(1);
});
process.on("unhandledRejection", (reason) => {
	logger.fatal({ reason }, "unhandled promise rejection");
	process.exit(1);
});
