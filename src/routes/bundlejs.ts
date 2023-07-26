import { route, APIError } from "~/libs/hono.ts";
import { PackagenameSchema } from "~/libs/npm.ts";
import { BundleSchema, getBundle } from "~/libs/bundlejs.ts";
import type { Bundle } from "~/libs/bundlejs.ts";
import cache from "~/libs/cache.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const BundleParamSchema = zod.object({ name: PackagenameSchema });
const BundleCache = cache<Bundle>();

export default route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/~/:name{.+$}": HOST.API("bundlejs/~/:name{.+$}"),
        },
      });
    })

    .get("/~/:name{.+$}", async (c) => {
      const parsedParam = await BundleParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = BundleCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await BundleSchema.safeParseAsync(await getBundle(name));

        if (parsedData.success) return c.json(BundleCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
