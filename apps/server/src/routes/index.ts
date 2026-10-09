import { enabledSocialProviders } from "@type-ninja/auth";
import { Hono } from "hono";
import type { AuthVariables } from "../lib/auth-middleware";
import content from "./content";
import health from "./health";
import leaderboards from "./leaderboards";
import resultsRoute from "./results";
import usersRoute from "./users";

const routes = new Hono<{ Variables: AuthVariables }>();

routes.route("/health", health);
routes.get("/meta", (c) =>
	c.json({
		socialProviders: enabledSocialProviders(),
		version: process.env.APP_VERSION ?? "dev",
	})
);
routes.route("/", content);
routes.route("/results", resultsRoute);
routes.route("/users", usersRoute);
routes.route("/leaderboards", leaderboards);

export default routes;
