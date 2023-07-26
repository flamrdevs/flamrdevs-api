import { route, APIError } from "~/libs/hono.ts";
import {
  PackagenameSchema,
  PackageSchema,
  DownloadsPointSchema,
  DownloadsRangeSchema,
  getPackage,
  getWeekDownloadsPoint,
  getMonthDownloadsPoint,
  getWeekDownloadsRange,
  getMonthDownloadsRange,
} from "~/libs/npm.ts";
import type { Package, DownloadsPoint, DownloadsRange } from "~/libs/npm.ts";
import cache from "~/libs/cache.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const PackageParamSchema = zod.object({ name: PackagenameSchema });
const PackageCache = cache<Package>();
const DownloadsPointWeekCache = cache<DownloadsPoint>();
const DownloadsPointMonthCache = cache<DownloadsPoint>();
const DownloadsRangeWeekCache = cache<DownloadsRange>();
const DownloadsRangeMonthCache = cache<DownloadsRange>();

export default route((x) =>
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
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = PackageCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await PackageSchema.safeParseAsync(await getPackage(name));

        if (parsedData.success) return c.json(PackageCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpw/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await DownloadsPointSchema.safeParseAsync(await getWeekDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpm/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await DownloadsPointSchema.safeParseAsync(await getMonthDownloadsPoint(name));

        if (parsedData.success) return c.json(DownloadsPointMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drw/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeWeekCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await DownloadsRangeSchema.safeParseAsync(await getWeekDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeWeekCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drm/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeMonthCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await DownloadsRangeSchema.safeParseAsync(await getMonthDownloadsRange(name));

        if (parsedData.success) return c.json(DownloadsRangeMonthCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
