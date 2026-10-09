import { env } from "@type-ninja/env/server";
import { Pool } from "pg";

let pool: Pool | null = null;

export function createPool() {
	if (!env.DATABASE_LOCAL_URL) {
		throw new Error("DATABASE_LOCAL_URL is not defined");
	}

	pool = new Pool({
		connectionString: env.DATABASE_LOCAL_URL,
		max: 10,
		idleTimeoutMillis: 30_000,
		connectionTimeoutMillis: 2000,
		ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
	});

	return pool;
}

export function getPool() {
	if (!pool) {
		throw new Error("Database not initialized");
	}
	return pool;
}

export async function closePool() {
	if (pool) {
		await pool.end();
		pool = null;
	}
}
