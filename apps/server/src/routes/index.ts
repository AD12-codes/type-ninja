import { Hono } from "hono";
import health from "./health";

// import usage from "./usage"
// import billing from "./billing"

const routes = new Hono();

routes.route("/health", health);
// routes.route("/usage", usage)
// routes.route("/billing", billing)

export default routes;
