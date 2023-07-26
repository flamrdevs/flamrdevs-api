import { hono } from "~/libs/exports.ts";

import { HOST } from "~/utils/exports.ts";

export default hono.route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/env": HOST.API("~/env"),
        },
      });
    })

    .get("/env", (c) => {
      return c.json({
        MODE: Deno.env.get("MODE"),
      });
    })
);
