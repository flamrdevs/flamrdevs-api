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
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = PackageCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await npm.PackageSchema.safeParseAsync(await npm.getPackage(name));

        if (parsedData.success) return c.json(PackageCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await npm.DownloadsPointSchema.safeParseAsync(await npm.getWeekDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await npm.DownloadsPointSchema.safeParseAsync(await npm.getMonthDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drw/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await npm.DownloadsRangeSchema.safeParseAsync(await npm.getWeekDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drm/:name{.+$}", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await npm.DownloadsRangeSchema.safeParseAsync(await npm.getMonthDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
