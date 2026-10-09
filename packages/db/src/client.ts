import { env } from "@type-ninja/env/server";
import { Pool } from "pg";

let pool: Pool | null = null;

const MAX_CONNECTIONS = 10;
const IDLE_TIMEOUT_MS = 30_000;
const CONNECTION_TIMEOUT_MS = 5000;

export function createPool() {
	pool = new Pool({
		connectionString: env.DATABASE_URL,
		max: MAX_CONNECTIONS,
		idleTimeoutMillis: IDLE_TIMEOUT_MS,
		connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
	});
	return pool;
}

export function getPool() {
	if (!pool) {
		return createPool();
	}
	return pool;
}

export async function closePool() {
	if (pool) {
		await pool.end();
		pool = null;
	}
}
