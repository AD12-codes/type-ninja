import { logger } from "@type-ninja/core/logger";
import { closePool, createPool } from "./client";
import { getDB, resetDB } from "./drizzle";

export type { Database } from "./drizzle";
export { getDB } from "./drizzle";

export async function initializeDB() {
	const pool = createPool();
	await pool.query("select 1");
	logger.info("database initialized successfully");
	getDB();
}

export async function closeDB() {
	await closePool();
	resetDB();
}
