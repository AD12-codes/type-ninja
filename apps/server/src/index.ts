import { initializeAuth } from "@ad-stack/auth";
import { logger } from "@ad-stack/core/logger";
import { closeDB, initializeDB } from "@ad-stack/db";
import { redisService } from "@ad-stack/db/redis";
import { serve } from "bun";
import { app } from "./app";

const PORT = Number(process.env.PORT ?? 3000);

// Bootstrap
async function bootstrap() {
	logger.info("Initializing services");

	await redisService.connect();
	await initializeDB();
	initializeAuth();

	logger.info("Starting server");

	const server = serve({
		fetch: app.fetch,
		port: PORT,
	});

	logger.info(
		{
			port: PORT,
			env: process.env.NODE_ENV ?? "development",
		},
		"Server started successfully"
	);

	return server;
}

const server = await bootstrap();

// Graceful shutdown
process.on("SIGINT", async () => {
	logger.info("SIGINT received, shutting down");
	await closeDB();
	server.stop();
	process.exit(0);
});

process.on("SIGTERM", async () => {
	logger.info("SIGTERM received, shutting down");
	await closeDB();
	server.stop();
	process.exit(0);
});

process.on("uncaughtException", (error) => {
	logger.fatal({ error }, "Uncaught exception");
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	logger.fatal({ reason }, "Unhandled promise rejection");
	process.exit(1);
});
