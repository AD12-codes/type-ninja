import { logger } from "@type-ninja/core/logger";
import { env } from "@type-ninja/env/server";
import Redis from "ioredis";

class RedisService {
	private client: Redis | null = null;

	async connect(): Promise<void> {
		if (this.client) {
			return;
		}

		this.client = new Redis(env.REDIS_URL, {
			maxRetriesPerRequest: 3,
			retryStrategy(times) {
				const delay = Math.min(times * 200, 2000);
				return delay;
			},
			lazyConnect: true,
		});

		this.client.on("error", (err) => {
			logger.error(`[Redis] Connection error: ${err.message}`);
		});

		this.client.on("connect", () => {
			logger.info("[Redis] Connected successfully");
		});

		await this.client.connect();
	}

	getClient(): Redis {
		if (!this.client) {
			throw new Error("[Redis] Client not initialized. Call connect() first.");
		}
		return this.client;
	}

	async disconnect(): Promise<void> {
		if (this.client) {
			await this.client.quit();
			this.client = null;
			logger.info("[Redis] Disconnected");
		}
	}

	async isHealthy(): Promise<boolean> {
		try {
			if (!this.client) {
				return false;
			}
			const pong = await this.client.ping();
			return pong === "PONG";
		} catch {
			return false;
		}
	}
}

export const redisService = new RedisService();
