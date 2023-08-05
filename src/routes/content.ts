import { content, hono } from "~/libs/exports.ts";

import { HOST, MIDDLEWARES } from "~/utils/exports.ts";

export default hono.route((x) =>
  x

    .use("*", MIDDLEWARES.cache30D)

    .get("/", (ctx) => {
      return ctx.json({
        endpoints: {
          "/projects": HOST.API("content/projects"),
        },
      });
    })

    .get("/projects", (ctx) => {
      return ctx.json(content.projects);
    })
);
