import { cors, compress } from "~/libs/@hono/middleware.ts";
import { dayjs, hono, nanoid } from "~/libs/exports.ts";

import routeTilde from "~/routes/~.ts";
import routeContent from "~/routes/content.ts";
import routeGithub from "~/routes/github.ts";
import routeNPM from "~/routes/npm.ts";
import routeBundlejs from "~/routes/bundlejs.ts";

import { MIDDLEWARES } from "~/utils/exports.ts";

const build = dayjs.create().format("DD-MM-YYYY");
const id = nanoid.create();

const app = hono
  .create()

  .use("*", cors({ origin: "*" }))
  .use("*", compress())

  .route("/~", routeTilde)
  .route("/content", routeContent)
  .route("/github", routeGithub)
  .route("/npm", routeNPM)
  .route("/bundlejs", routeBundlejs)

  .get("/", MIDDLEWARES.cache30D, (c) => c.json({ name: "api", build }, 200, { "x-me": "flamrdevs", "x-id": id }))
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
