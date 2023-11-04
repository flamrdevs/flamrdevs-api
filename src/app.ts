import { Hono } from "hono/mod.ts";
import { cors, compress, logger, secureHeaders } from "hono/middleware.ts";

import * as v from "valibot/mod.ts";

import * as error from "~/libs/error.ts";

import routeTilde from "~/routes/~.ts";
import routeAuth from "~/routes/auth.ts";

const app = new Hono()
  .use("*", logger())
  .use("*", cors({ origin: "*" }))

  .get("/health", (ctx) => {
    return ctx.json({ ok: true }, 200);
  })

  .use("*", compress(), secureHeaders())

  .route("/~", routeTilde)
  .route("/auth", routeAuth)

  .get("/", (ctx) => ctx.json({ name: "api" }))
  .notFound((ctx) => ctx.json({ message: "Not found" }, 404))
  .onError((_error: unknown, ctx) => {
    let status = 500;
    let message = "Internal server error";

    if (_error instanceof error.API) {
      status = _error.status;
      message = _error.message;
    } else if (_error instanceof v.ValiError) {
      status = 400;
      message = _error.issues.at(0)?.message ?? _error.message;
    } else if (_error instanceof Error) {
      message = _error.message;
    }

    return ctx.json({ message }, status);
  });

export default app;
