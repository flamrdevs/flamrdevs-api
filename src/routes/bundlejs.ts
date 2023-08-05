import { bundlejs, hono, npm, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const BundleParamSchema = zod.z.object({ name: npm.PackagenameSchema });

export default hono.route((x) =>
  x

    .get("/", MIDDLEWARES.cache30D, (c) => {
      return c.json({
        endpoints: {
          "/~/:name{.+$}": HOST.API("bundlejs/~/:name{.+$}"),
        },
      });
    })

    .get("/~/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await BundleParamSchema.parseAsync(c.req.param());

      const [cache, data] = await bundlejs.getBundle(param.name);

      return c.json(await bundlejs.BundleSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })
);
