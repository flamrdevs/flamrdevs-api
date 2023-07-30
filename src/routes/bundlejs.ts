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
      const parsedParam = await BundleParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = BundleCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await bundlejs.BundleSchema.safeParseAsync(await bundlejs.getBundle(name));

        if (parsedData.success) return c.json(BundleCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
