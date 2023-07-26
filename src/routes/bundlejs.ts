import { bundlejs, cache, hono, npm, valibot } from "~/libs/exports.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const BundleParamSchema = valibot.object({ name: npm.PackagenameSchema });
const BundleCache = cache.create<bundlejs.Bundle>();

export default hono.route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/~/:name{.+$}": HOST.API("bundlejs/~/:name{.+$}"),
        },
      });
    })

    .get("/~/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(BundleParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = BundleCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(bundlejs.BundleSchema, await bundlejs.getBundle(name));

        if (parsedData.success) return c.json(BundleCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
