import { redisService } from "@type-ninja/db/redis";
import type { DependencyCheckResult } from "../types";

export async function checkRedis(): Promise<DependencyCheckResult> {
	const started = Date.now();

	try {
		await redisService.connect();
		const redis = redisService.getClient();
		await redis.ping();
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
