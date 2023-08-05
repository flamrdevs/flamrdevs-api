import { bundlejs, cache, hono, npm, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const BundleParamSchema = zod.z.object({ name: npm.PackagenameSchema });
const BundleCache = cache.create<bundlejs.Bundle>();

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

      const { name } = param;
      const key = name;

      const cached = BundleCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await bundlejs.BundleSchema.parseAsync(await bundlejs.getBundle(name));

      return c.json(BundleCache.set(key, data), 200, HEADERS.NOCACHE);
    })
);
