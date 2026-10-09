import { env } from "@type-ninja/env/web";
import type { ApiError } from "@type-ninja/shared/api";

export const API_BASE = env.VITE_SERVER_URL ?? "";

export class ApiRequestError extends Error {
	readonly status: number;
	readonly code: string;
	readonly details?: unknown;

	constructor(
		status: number,
		code: string,
		message: string,
		details?: unknown
	) {
		super(message);
		this.name = "ApiRequestError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(`${API_BASE}/api/v1${path}`, {
		credentials: "include",
		...init,
		headers: {
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...init.headers,
		},
	});
	if (!response.ok) {
		let payload: ApiError | null = null;
		try {
			payload = (await response.json()) as ApiError;
		} catch {
			payload = null;
		}
		throw new ApiRequestError(
			response.status,
			payload?.error.code ?? "HTTP_ERROR",
			payload?.error.message ?? response.statusText,
			payload?.error.details
		);
	}
	return (await response.json()) as T;
}

export function query(
	params: Record<string, string | number | undefined>
): string {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== "") {
			search.set(key, String(value));
		}
	}
	const text = search.toString();
	return text ? `?${text}` : "";
}
