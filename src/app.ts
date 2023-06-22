import { Hono, cors, compress, headers, json } from "~/libs/hono.ts";

import cache from "~/libs/@hono/cache.ts";

import routeTilde from "~/routes/~.ts";
import routeProjects from "~/routes/projects.ts";

import { isTypeElse } from "~/utils/string.ts";

const app = new Hono()

  .use("*", cors({ origin: "*" }))
  .use("*", compress())

  .use("*", cache())

  .route("/~", routeTilde)

  .route("/projects", routeProjects)

  .get("/", (c) => {
    return json(headers(c, { "x-me": "flamrdevs" }), 200, {
      name: "flamrdevs-api",
    });
  })

  .notFound((c) => {
    return json(c, 404, {
      message: "not found",
    });
  })

  .onError((error, c) => {
    return json(c, 500, {
      message: isTypeElse(error.message, "internal server error"),
    });
  });

export default app;
