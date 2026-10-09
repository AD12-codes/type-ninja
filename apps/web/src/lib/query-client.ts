import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

/**
 * Production-grade QueryClient configuration.
 *
 * Defaults are tuned for a balance between freshness and performance:
 * - `staleTime` of 60s prevents redundant network requests across navigations.
 * - `gcTime` of 5 min keeps inactive data in cache for fast back-navigations.
 * - Retries use exponential back-off capped at 30s.
 * - `refetchOnWindowFocus` is disabled to avoid unexpected UI flickers;
 *   enable per-query where real-time freshness matters.
 * - `throwOnError` is false to let error boundaries opt-in rather than crash.
 */

const STALE_TIME = 1000 * 60; // 60 seconds
const GC_TIME = 1000 * 60 * 5; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000; // 1 second
const RETRY_MAX_DELAY = 30_000; // 30 seconds

/**
 * Exponential back-off with jitter.
 * Prevents retry storms when the server is overloaded.
 */
function retryDelay(attemptIndex: number): number {
	const delay = Math.min(RETRY_BASE_DELAY * 2 ** attemptIndex, RETRY_MAX_DELAY);
	// Add ±25% jitter to spread retries
	const jitter = delay * 0.25 * (Math.random() * 2 - 1);
	return delay + jitter;
}

/**
 * Determines whether a failed query should be retried.
 * - Never retry 4xx errors (client errors) except 408 (timeout) and 429 (rate-limit).
 * - Always retry network errors and 5xx errors up to MAX_RETRIES.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
	if (failureCount >= MAX_RETRIES) {
		return false;
	}

	// If the error carries an HTTP status, inspect it
	if (error instanceof Error && "status" in error) {
		const status = (error as Error & { status: number }).status;
		// Don't retry client errors (except timeout & rate-limit)
		if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
			return false;
		}
	}

	return true;
}

const queryClientConfig: QueryClientConfig = {
	defaultOptions: {
		queries: {
			staleTime: STALE_TIME,
			gcTime: GC_TIME,
			retry: shouldRetry,
			retryDelay,
			refetchOnWindowFocus: false,
			refetchOnReconnect: "always",
			throwOnError: false,
		},
		mutations: {
			retry: false, // Mutations should not auto-retry by default
			throwOnError: false,
			gcTime: GC_TIME,
		},
	},
};

/**
 * Creates a new QueryClient instance with production defaults.
 * Call this once at the application root.
 */
export function createQueryClient(): QueryClient {
	return new QueryClient(queryClientConfig);
}
