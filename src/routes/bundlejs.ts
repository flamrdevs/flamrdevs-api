import { route, headers, json, apierror } from "~/libs/hono.ts";
import { PackagenameSchema } from "~/libs/npm.ts";
import { BundleSchema, getBundle } from "~/libs/bundlejs.ts";
import type { Bundle } from "~/libs/bundlejs.ts";
import cache from "~/libs/cache.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import * as HOST from "~/utils/host.ts";

const BundleParamSchema = zod.object({ name: PackagenameSchema });
const BundleCache = cache<Bundle>();

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
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
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await BundleSchema.safeParseAsync(await getBundle(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, BundleCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
