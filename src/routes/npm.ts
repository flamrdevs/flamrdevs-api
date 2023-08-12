import { route } from "~/libs/hono.ts";
import {
  PackagenameSchema,
  PackageSchema,
  DownloadsPointSchema,
  DownloadsRangeSchema,
  getPackage,
  getWeekDownloadsPoint,
  getWeekDownloadsRange,
  getMonthDownloadsPoint,
  getMonthDownloadsRange,
} from "~/libs/npm.ts";

export default route((x) =>
  x

    .get("/~/:name{.+$}", async (ctx) => {
      return ctx.json(await PackageSchema.parseAsync(await getPackage(await PackagenameSchema.parseAsync(ctx.req.param("name")))));
    })

    .get("/dpw/:name{.+$}", async (ctx) => {
      return ctx.json(
        await DownloadsPointSchema.parseAsync(await getWeekDownloadsPoint(await PackagenameSchema.parseAsync(ctx.req.param("name"))))
      );
    })

    .get("/dpm/:name{.+$}", async (ctx) => {
      return ctx.json(
        await DownloadsPointSchema.parseAsync(await getMonthDownloadsPoint(await PackagenameSchema.parseAsync(ctx.req.param("name"))))
      );
    })

    .get("/drw/:name{.+$}", async (ctx) => {
      return ctx.json(
        await DownloadsRangeSchema.parseAsync(await getWeekDownloadsRange(await PackagenameSchema.parseAsync(ctx.req.param("name"))))
      );
    })

    .get("/drm/:name{.+$}", async (ctx) => {
      return ctx.json(
        await DownloadsRangeSchema.parseAsync(await getMonthDownloadsRange(await PackagenameSchema.parseAsync(ctx.req.param("name"))))
      );
    })
);
