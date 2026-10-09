import { drizzle } from "drizzle-orm/node-postgres";
import { getPool } from "./client";
import {
	accounts,
	accountsRelations,
	users,
	usersRelations,
	verifications,
} from "./schema/auth";

const schema = {
	users,
	accounts,
	verifications,
	usersRelations,
	accountsRelations,
};

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDB() {
	if (!dbInstance) {
		dbInstance = drizzle(getPool(), { schema });
	}
	return dbInstance;
}
