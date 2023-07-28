import { content, hono } from "~/libs/exports.ts";

import { HOST, MIDDLEWARES } from "~/utils/exports.ts";

export default hono.route((x) =>
  x

    .use("*", MIDDLEWARES.cache30D)

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
