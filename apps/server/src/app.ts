import { getAuth } from "@type-ninja/auth";
import { logger } from "@type-ninja/core/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes";

export const app = new Hono();

// Request logger middleware
app.use("*", async (c, next) => {
	const start = Date.now();

	logger.info(
		{
			method: c.req.method,
			path: c.req.path,
		},
		"Incoming request"
	);

	await next();

	logger.info(
		{
			method: c.req.method,
			path: c.req.path,
			status: c.res.status,
			duration: Date.now() - start,
		},
		"Request completed"
	);
});

// CORS
app.use(
	"*",
	cors({
		origin: process.env.CORS_ORIGIN ?? "*",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

// Auth handler (must be after CORS middleware)
// getAuth() is called at request time, after bootstrap has initialized DB + Redis
app.on(["POST", "GET"], "/api/auth/*", (c) => getAuth().handler(c.req.raw));

// Root
app.get("/", (c) => c.json({ status: "ok" }));

// Mount API routes
app.route("/api/v1", routes);

// 404 handler
app.notFound((c) =>
	c.json(
		{
			error: {
				code: "NOT_FOUND",
				message: "Route not found",
			},
		},
		404
	)
);

// Global error handler
app.onError((err, c) => {
	logger.error({ err }, "Unhandled error");

	return c.json(
		{
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message:
					process.env.NODE_ENV === "production"
						? "An unexpected error occurred"
						: err.message,
			},
		},
		500
	);
});
