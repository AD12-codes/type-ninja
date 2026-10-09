import { logger } from "@ad-stack/core/logger";
import { closePool, createPool } from "./client";
import { getDB } from "./drizzle";

export async function initializeDB() {
	const pool = createPool();
	// Fail fast check
	await pool.query("select 1");
	logger.info("database initialized successfully");
	getDB();
}

export async function closeDB() {
	await closePool();
}
