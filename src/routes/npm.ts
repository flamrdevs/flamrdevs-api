import { hono, npm, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const PackageParamSchema = zod.z.object({ name: npm.PackagenameSchema });

export default hono.route((x) =>
  x

    .get("/", MIDDLEWARES.cache30D, (c) => {
      return c.json({
        endpoints: {
          "/~/:name{.+$}": HOST.API("npm/~/:name{.+$}"),
          "/dpw/:name{.+$}": HOST.API("npm/dpw/:name{.+$}"),
          "/dpm/:name{.+$}": HOST.API("npm/dpm/:name{.+$}"),
          "/drw/:name{.+$}": HOST.API("npm/drw/:name{.+$}"),
          "/drm/:name{.+$}": HOST.API("npm/drm/:name{.+$}"),
        },
      });
    })

    .get("/~/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const [cache, data] = await npm.getPackage(param.name);

      return c.json(await npm.PackageSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/dpw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const [cache, data] = await npm.getWeekDownloadsPoint(param.name);

      return c.json(await npm.DownloadsPointSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/dpm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const [cache, data] = await npm.getMonthDownloadsPoint(param.name);

      return c.json(await npm.DownloadsPointSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/drw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const [cache, data] = await npm.getWeekDownloadsRange(param.name);

      return c.json(await npm.DownloadsRangeSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/drm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const [cache, data] = await npm.getMonthDownloadsRange(param.name);

      return c.json(await npm.DownloadsRangeSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })
);
