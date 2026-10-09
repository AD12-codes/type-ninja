export type DependencyStatus = "up" | "down";

export interface DependencyCheckResult {
	status: DependencyStatus;
	latencyMs?: number;
	error?: string;
}

export interface HealthResult {
	healthy: boolean;
	status: "ok" | "degraded";
	timestamp: string;
	services: Record<string, DependencyCheckResult>;
	meta: {
		uptimeSec: number;
		env: string;
	};
}
