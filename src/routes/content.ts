import { route, json } from "~/libs/hono.ts";
import { projects } from "~/libs/content.ts";

import * as HOST from "~/utils/host.ts";

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
        endpoints: {
          "/projects": HOST.API("content/projects"),
        },
      });
    })

    .get("/projects", (c) => {
      return json(c, 200, projects);
    })
);
