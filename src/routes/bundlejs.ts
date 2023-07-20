import { route, headers, json, apierror } from "~/libs/hono.ts";
import { PackagenameSchema, PackageSchema, getPackage } from "~/libs/bundlejs.ts";
import type { Package } from "~/libs/bundlejs.ts";
import cache from "~/libs/cache.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import * as HOST from "~/utils/host.ts";

const PackageParamSchema = zod.object({ name: PackagenameSchema });
const PackageCache = cache<Package>();

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
        endpoints: {
          "/:name{.+$}": HOST.API("bundlejs/:name{.+$}"),
        },
      });
    })

    .get("/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = PackageCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await PackageSchema.safeParseAsync(await getPackage(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, PackageCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
