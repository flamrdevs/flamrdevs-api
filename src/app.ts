import { Hono } from "hono/mod.ts";
import { cors, compress, logger, secureHeaders } from "hono/middleware.ts";

import * as v from "valibot/mod.ts";

import { __PROD__ } from "~/const/env.ts";

import * as err from "~/libs/err.ts";

import routeTilde from "~/routes/~.ts";
import routeAuth from "~/routes/auth.ts";
import routeContent from "~/routes/content.ts";
import routeGithub from "~/routes/github.ts";

const app = new Hono();

if (!__PROD__) app.use("*", logger());

app
  .use("*", cors({ origin: "*" }))

  .get("/ping", (ctx) => ctx.text("pong", 200))

  .use("*", compress(), secureHeaders())

  .route("/~", routeTilde)
  .route("/auth", routeAuth)
  .route("/content", routeContent)
  .route("/github", routeGithub)

  .get("/", (ctx) => ctx.json({ name: "api" }))
  .notFound((ctx) => ctx.json({ message: "Not found" }, 404))
  .onError((error: unknown, ctx) => {
    let status = 500;
    let message = "Internal server error";

    if (error instanceof err.APIError) {
      status = error.status;
      message = error.message;
    } else if (error instanceof v.ValiError) {
      status = 400;
      message = error.issues.at(0)?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return ctx.json({ message }, status);
  });

export default app;
