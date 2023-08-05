import { hono, npm, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const PackageParamSchema = zod.z.object({ name: npm.PackagenameSchema });

export default hono.route((x) =>
  x

    .get("/", MIDDLEWARES.cache30D, (ctx) => {
      return ctx.json({
        endpoints: {
          "/~/:name{.+$}": HOST.API("npm/~/:name{.+$}"),
          "/dpw/:name{.+$}": HOST.API("npm/dpw/:name{.+$}"),
          "/dpm/:name{.+$}": HOST.API("npm/dpm/:name{.+$}"),
          "/drw/:name{.+$}": HOST.API("npm/drw/:name{.+$}"),
          "/drm/:name{.+$}": HOST.API("npm/drm/:name{.+$}"),
        },
      });
    })

    .get("/~/:name{.+$}", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await PackageParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await npm.getPackage(param.name);

      return ctx.json(await npm.PackageSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/dpw/:name{.+$}", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await PackageParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await npm.getWeekDownloadsPoint(param.name);

      return ctx.json(await npm.DownloadsPointSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/dpm/:name{.+$}", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await PackageParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await npm.getMonthDownloadsPoint(param.name);

      return ctx.json(await npm.DownloadsPointSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/drw/:name{.+$}", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await PackageParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await npm.getWeekDownloadsRange(param.name);

      return ctx.json(await npm.DownloadsRangeSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/drm/:name{.+$}", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await PackageParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await npm.getMonthDownloadsRange(param.name);

      return ctx.json(await npm.DownloadsRangeSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })
);
