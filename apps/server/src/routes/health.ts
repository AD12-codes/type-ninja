import { getHealth } from "@type-ninja/health";
import { Hono } from "hono";

const health = new Hono();

health.get("/", async (c) => {
	const result = await getHealth();
	const statusCode = result.healthy ? 200 : 503;
	return c.json(result, statusCode);
});

export default health;
