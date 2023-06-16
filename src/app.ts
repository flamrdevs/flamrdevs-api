import { Hono, cors, compress, headers, json } from "~/libs/hono.ts";

import cache from "~/libs/@hono/cache.ts";

import routeTilde from "~/routes/~.ts";

import { getString } from "~/utils/other.ts";

const app = new Hono()

  .use("*", cors({ origin: "*" }))
  .use("*", compress())

  .use("*", cache())

  .route("/~", routeTilde)

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
      message: getString(error.message, "internal server error"),
    });
  });

export default app;
