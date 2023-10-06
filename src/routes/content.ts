import { route, cachePlugin } from "~/libs/hono.ts";
import { projects } from "~/libs/content.ts";

export default route((x) =>
  x
    .use("*", cachePlugin())

    .get("/projects", (ctx) => {
      return ctx.json(projects);
    })
);
