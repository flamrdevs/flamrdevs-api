import { hono } from "~/libs/exports.ts";

import { HOST, MIDDLEWARES } from "~/utils/exports.ts";

export default hono.route((x) =>
  x

    .use("*", MIDDLEWARES.cache30D)

    .get("/", (ctx) => {
      return ctx.json({
        endpoints: {
          "/env": HOST.API("~/env"),
        },
      });
    })

    .get("/env", (ctx) => {
      return ctx.json({
        MODE: Deno.env.get("MODE"),
      });
    })
);
