import { existsSync } from "node:fs";
import { join } from "node:path";
import { getAuth } from "@type-ninja/auth";
import { logger } from "@type-ninja/core/logger";
import { env } from "@type-ninja/env/server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { type AuthVariables, sessionMiddleware } from "./lib/auth-middleware";
import { HttpError } from "./lib/errors";
import routes from "./routes";

export const app = new Hono<{ Variables: AuthVariables }>();

const SLOW_REQUEST_MS = 1000;

app.use("/api/*", async (c, next) => {
	const start = Date.now();
	await next();
	const duration = Date.now() - start;
	const level = duration > SLOW_REQUEST_MS ? "warn" : "debug";
	logger[level](
		{ method: c.req.method, path: c.req.path, status: c.res.status, duration },
		"request"
	);
});

if (env.CORS_ORIGIN) {
	app.use(
		"/api/*",
		cors({
			origin: env.CORS_ORIGIN,
			allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
			allowHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		})
	);
}

app.on(["POST", "GET"], "/api/auth/*", (c) => getAuth().handler(c.req.raw));

app.use("/api/*", sessionMiddleware);
app.route("/api/v1", routes);

app.notFound((c) => {
	if (c.req.path.startsWith("/api/")) {
		return c.json(
			{ error: { code: "NOT_FOUND", message: "Route not found" } },
			404
		);
	}
	return c.text("Not found", 404);
});

app.onError((err, c) => {
	if (err instanceof HttpError) {
		return c.json(
			{ error: { code: err.code, message: err.message, details: err.details } },
			err.status
		);
	}
	logger.error({ err }, "Unhandled error");
	return c.json(
		{
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message:
					env.NODE_ENV === "production"
						? "An unexpected error occurred"
						: err.message,
			},
		},
		500
	);
});

/** In production the API serves the built web app with an SPA fallback. */
export function mountStaticWeb(distDir: string) {
	if (!existsSync(join(distDir, "index.html"))) {
		logger.warn(
			{ distDir },
			"WEB_DIST_DIR has no index.html; static serving disabled"
		);
		return;
	}
	logger.info({ distDir }, "serving web app");
	app.use("/*", serveStatic({ root: distDir }));
	app.get("/*", serveStatic({ root: distDir, path: "index.html" }));
}
