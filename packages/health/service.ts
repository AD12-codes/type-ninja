import { checkDatabase } from "./checks/db";
import { checkRedis } from "./checks/redis";
import type { HealthResult } from "./types";

export async function getHealth(): Promise<HealthResult> {
	const [database, redis] = await Promise.all([checkDatabase(), checkRedis()]);

	const services = { database, redis };

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
