import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpError extends Error {
	readonly status: ContentfulStatusCode;
	readonly code: string;
	readonly details?: unknown;

	constructor(
		status: ContentfulStatusCode,
		code: string,
		message: string,
		details?: unknown
	) {
		super(message);
		this.name = "HttpError";
		this.status = status;
		this.code = code;
		this.details = details;
	}
}

export const notFound = (message = "Not found") =>
	new HttpError(404, "NOT_FOUND", message);
export const badRequest = (message: string, details?: unknown) =>
	new HttpError(400, "BAD_REQUEST", message, details);
export const unauthorized = () =>
	new HttpError(401, "UNAUTHORIZED", "You must be signed in");
export const conflict = (message: string) =>
	new HttpError(409, "CONFLICT", message);
