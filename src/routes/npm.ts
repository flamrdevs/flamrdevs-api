import { cache, hono, npm, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const PackageParamSchema = zod.z.object({ name: npm.PackagenameSchema });
const PackageCache = cache.create<npm.Package>();
const DownloadsPointWeekCache = cache.create<npm.DownloadsPoint>();
const DownloadsPointMonthCache = cache.create<npm.DownloadsPoint>();
const DownloadsRangeWeekCache = cache.create<npm.DownloadsRange>();
const DownloadsRangeMonthCache = cache.create<npm.DownloadsRange>();

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

      const { name } = param;
      const key = name;

      const cached = PackageCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await npm.PackageSchema.parseAsync(await npm.getPackage(name));

      return c.json(PackageCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/dpw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const { name } = param;
      const key = name;

      const cached = DownloadsPointWeekCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await npm.DownloadsPointSchema.parseAsync(await npm.getWeekDownloadsPoint(name));

      return c.json(DownloadsPointWeekCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/dpm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const { name } = param;
      const key = name;

      const cached = DownloadsPointMonthCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await npm.DownloadsPointSchema.parseAsync(await npm.getMonthDownloadsPoint(name));

      return c.json(DownloadsPointMonthCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/drw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const { name } = param;
      const key = name;

      const cached = DownloadsRangeWeekCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await npm.DownloadsRangeSchema.parseAsync(await npm.getWeekDownloadsRange(name));

      return c.json(DownloadsRangeWeekCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/drm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const param = await PackageParamSchema.parseAsync(c.req.param());

      const { name } = param;
      const key = name;

      const cached = DownloadsRangeMonthCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await npm.DownloadsRangeSchema.parseAsync(await npm.getMonthDownloadsRange(name));

      return c.json(DownloadsRangeMonthCache.set(key, data), 200, HEADERS.NOCACHE);
    })
);
