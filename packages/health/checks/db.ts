import { getDB } from "@ad-stack/db/drizzle";
import { sql } from "drizzle-orm";
import type { DependencyCheckResult } from "../types";

export async function checkDatabase(): Promise<DependencyCheckResult> {
	const started = Date.now();
	const db = getDB();

	try {
		await db.execute(sql`select 1`);
		return {
			status: "up",
			latencyMs: Date.now() - started,
		};
	} catch (error) {
		return {
			status: "down",
			latencyMs: Date.now() - started,
			error: error instanceof Error ? error.message : "unknown",
		};
	}
}
