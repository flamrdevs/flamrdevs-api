import { hono } from "~/libs/exports.ts";
import { cors, compress, cache } from "~/libs/@hono/middlewares.ts";

import routeTilde from "~/routes/~.ts";
import routeContent from "~/routes/content.ts";
import routeGithub from "~/routes/github.ts";
import routeNPM from "~/routes/npm.ts";
import routeBundlejs from "~/routes/bundlejs.ts";

const app = hono
  .create()

  .use("*", cors({ origin: "*" }))
  .use("*", compress())
  .use("*", cache())

  .route("/~", routeTilde)
  .route("/content", routeContent)
  .route("/github", routeGithub)
  .route("/npm", routeNPM)
  .route("/bundlejs", routeBundlejs)

  .get("/", (c) => c.json({ name: "api" }, 200, { "x-me": "flamrdevs" }))
  .notFound((c) => c.json({ message: "Not found" }, 404))
  .onError((error: unknown, c) => {
    let status = 500;
    let message = "Internal server error";

    if (hono.APIError.is(error)) {
      status = error.status;
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return c.json({ message }, status);
  });

export default app;
