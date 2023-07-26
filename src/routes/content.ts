import { content, hono } from "~/libs/exports.ts";

import { HOST } from "~/utils/exports.ts";

export default hono.route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/projects": HOST.API("content/projects"),
        },
      });
    })

    .get("/projects", (c) => {
      return c.json(content.projects);
    })
);
