import { route } from "~/libs/hono.ts";

import { HOST } from "~/utils/exports.ts";

export default route((x) =>
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
