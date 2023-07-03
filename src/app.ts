import { Hono, headers, json, isAPIError } from "~/libs/hono.ts";
import { cors, compress, cache } from "~/libs/@hono/middlewares.ts";

import routeTilde from "~/routes/~.ts";
import routeGithub from "~/routes/github.ts";
import routeProjects from "~/routes/projects.ts";

const app = new Hono()

  .use("*", cors({ origin: "*" }))
  .use("*", compress())
  .use("*", cache())

  .route("/~", routeTilde)
  .route("/github", routeGithub)
  .route("/projects", routeProjects)

  .get("/", (c) => json(headers(c, { "x-me": "flamrdevs" }), 200, { name: "api" }))
  .notFound((c) => json(c, 404, { message: "Not found" }))
  .onError((error: unknown, c) => {
    let status = 500;
    let message = "Internal server error";

    if (isAPIError(error)) {
      status = error.status;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return json(c, status, { message });
  });

export default app;
