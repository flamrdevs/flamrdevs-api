import { route, headers, json, apierror } from "~/libs/hono.ts";
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

import * as HOST from "~/utils/host.ts";

const PackageParamSchema = zod.object({ name: PackagenameSchema });
const PackageCache = cache<Package>();
const DownloadsPointWeekCache = cache<DownloadsPoint>();
const DownloadsPointMonthCache = cache<DownloadsPoint>();
const DownloadsRangeWeekCache = cache<DownloadsRange>();
const DownloadsRangeMonthCache = cache<DownloadsRange>();

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
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
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await PackageSchema.safeParseAsync(await getPackage(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, PackageCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpw/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointWeekCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await DownloadsPointSchema.safeParseAsync(await getWeekDownloadsPoint(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, DownloadsPointWeekCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/dpm/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsPointMonthCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await DownloadsPointSchema.safeParseAsync(await getMonthDownloadsPoint(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, DownloadsPointMonthCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drw/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeWeekCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await DownloadsRangeSchema.safeParseAsync(await getWeekDownloadsRange(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, DownloadsRangeWeekCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/drm/:name{.+$}", async (c) => {
      const parsedParam = await PackageParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { name } = parsedParam.data;
        const key = name;

        const cached = DownloadsRangeMonthCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const parsedData = await DownloadsRangeSchema.safeParseAsync(await getMonthDownloadsRange(name));

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, DownloadsRangeMonthCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
