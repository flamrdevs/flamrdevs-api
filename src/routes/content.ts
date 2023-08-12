import { route } from "~/libs/hono.ts";
import { projects } from "~/libs/content.ts";

export default route((x) =>
  x.get("/projects", (ctx) => {
    return ctx.json(projects);
  })
);
