import { cache, hono, npm, valibot } from "~/libs/exports.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const PackageParamSchema = valibot.object({ name: npm.PackagenameSchema });
const PackageCache = cache.create<npm.Package>();
const DownloadsPointWeekCache = cache.create<npm.DownloadsPoint>();
const DownloadsPointMonthCache = cache.create<npm.DownloadsPoint>();
const DownloadsRangeWeekCache = cache.create<npm.DownloadsRange>();
const DownloadsRangeMonthCache = cache.create<npm.DownloadsRange>();

export default hono.route((x) =>
  x

    .get("/", (c) => {
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

    .get("/~/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(PackageParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = PackageCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(npm.PackageSchema, await npm.getPackage(name));

        if (parsedData.success) return c.json(PackageCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpw/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(PackageParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(npm.DownloadsPointSchema, await npm.getWeekDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpm/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(PackageParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(npm.DownloadsPointSchema, await npm.getMonthDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drw/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(PackageParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(npm.DownloadsRangeSchema, await npm.getWeekDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drm/:name{.+$}", async (c) => {
      const parsedParam = await valibot.safeParseAsync(PackageParamSchema, c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(npm.DownloadsRangeSchema, await npm.getMonthDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
