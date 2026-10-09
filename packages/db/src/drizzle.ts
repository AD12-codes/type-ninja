import { drizzle } from "drizzle-orm/node-postgres";
import { getPool } from "./client";
import * as schema from "./schema";

export type Database = ReturnType<typeof createDrizzle>;

function createDrizzle() {
	return drizzle(getPool(), { schema });
}

let dbInstance: Database | null = null;

export function getDB(): Database {
	if (!dbInstance) {
		dbInstance = createDrizzle();
	}
	return dbInstance;
}

export function resetDB() {
	dbInstance = null;
}
