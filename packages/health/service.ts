import { checkDatabase } from "./checks/db";
import type { HealthResult } from "./types";

export async function getHealth(): Promise<HealthResult> {
	const database = await checkDatabase();
	const services = { database };
	const criticalDown = Object.values(services).some((s) => s.status === "down");

	return {
		healthy: !criticalDown,
		status: criticalDown ? "degraded" : "ok",
		timestamp: new Date().toISOString(),
		services,
		meta: {
			uptimeSec: Math.round(process.uptime()),
			env: process.env.NODE_ENV ?? "development",
		},
	};
}
