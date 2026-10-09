import type { z } from "zod";
import { badRequest } from "./errors";

export function parseOrThrow<T extends z.ZodType>(
	schema: T,
	value: unknown
): z.infer<T> {
	const result = schema.safeParse(value);
	if (!result.success) {
		throw badRequest("Invalid request", result.error.issues);
	}
	return result.data;
}
