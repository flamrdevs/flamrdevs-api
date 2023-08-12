import { route } from "~/libs/hono.ts";
import { BundleSchema, getBundle } from "~/libs/bundlejs.ts";
import { PackagenameSchema } from "~/libs/npm.ts";

export default route((x) =>
  x.get("/~/:name{.+$}", async (ctx) => {
    return ctx.json(await BundleSchema.parseAsync(await getBundle(await PackagenameSchema.parseAsync(ctx.req.param("name")))));
  })
);
