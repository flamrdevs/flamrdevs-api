import { route } from "~/libs/hono.ts";
import { projects } from "~/libs/content.ts";

import { HOST } from "~/utils/exports.ts";

export default route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/projects": HOST.API("content/projects"),
        },
      });
    })

    .get("/projects", (c) => {
      return c.json(projects);
    })
);
