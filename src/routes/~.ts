import { route, json } from "~/libs/hono.ts";

import * as HOST from "~/utils/host.ts";

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
        endpoints: {
          "/env": HOST.API("~", "env"),
        },
      });
    })

    .get("/env", (c) => {
      return json(c, 200, {
        MODE: Deno.env.get("MODE"),
      });
    })
);
