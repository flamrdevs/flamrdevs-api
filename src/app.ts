import { Hono } from "hono/mod.ts";
import { cors, compress, logger, secureHeaders } from "hono/middleware.ts";

import { ZodError } from "zod/mod.ts";

import { __PROD__ } from "~/const/env.ts";

import { cachePlugin } from "~/libs/hono.ts";

import routeTilde from "~/routes/~.ts";
import routeContent from "~/routes/content.ts";
import routeGithub from "~/routes/github.ts";

const app = new Hono();

if (!__PROD__) app.use("*", logger());

app
  .use("*", cors({ origin: "*" }), compress(), secureHeaders(), cachePlugin())

  .route("/~", routeTilde)
  .route("/content", routeContent)
  .route("/github", routeGithub)

  .get("/", (ctx) => ctx.json({ name: "api" }))
  .notFound((ctx) => ctx.json({ message: "Not found" }, 404))
  .onError((error: unknown, ctx) => {
    let status = 500;
    let message = "Internal server error";

    if (error instanceof ZodError) {
      status = 400;
      message = error.issues.at(0)?.message ?? "Bad request";
    } else if (error instanceof Error) {
      message = error.message;
    }

    return ctx.json({ message }, status);
  });

export default app;
