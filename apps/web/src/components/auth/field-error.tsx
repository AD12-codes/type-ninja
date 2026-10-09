export function FieldError({ errors }: { errors: unknown[] }) {
	const message = errors
		.map((e) =>
			typeof e === "string" ? e : (e as { message?: string })?.message
		)
		.filter(Boolean)[0];
	if (!message) {
		return null;
	}
	return <p className="text-error text-xs">{message}</p>;
}
