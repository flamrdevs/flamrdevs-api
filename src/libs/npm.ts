import { z } from "zod/mod.ts";

import { get } from "~/libs/fetch.ts";

const PackagenameSchema = z
  .string({ required_error: "Package name is required", invalid_type_error: "Package name must be a string" })
  .regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, { message: "Invalid NPM package name" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Package name cannot end with a hyphen" });

type Package = z.infer<typeof PackageSchema>;

const PackageSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.optional(z.string()),
});

type DownloadsPoint = z.infer<typeof DownloadsPointSchema>;

const DownloadsPointSchema = z.object({
  package: z.string(),
  start: z.string(),
  end: z.string(),
  downloads: z.number(),
});

type DownloadsRange = z.infer<typeof DownloadsRangeSchema>;

const DownloadsRangeSchema = z.object({
  package: z.string(),
  start: z.string(),
  end: z.string(),
  downloads: z.array(
    z.object({
      day: z.string(),
      downloads: z.number(),
    })
  ),
});

const base = {
  registry: (...paths: string[]) => ["https://registry.npmjs.org"].concat(paths).join("/"),
  api: (...paths: string[]) => ["https://api.npmjs.org"].concat(paths).join("/"),
};

const $Package: Record<string, Package> = {};
const getPackage = async (name: string): Promise<Package> => ($Package[name] ??= await get<Package>(base.registry(name, "latest")));

const $DownloadsPointWeek: Record<string, DownloadsPoint> = {};
const getWeekDownloadsPoint = async (name: string): Promise<DownloadsPoint> =>
  ($DownloadsPointWeek[name] ??= await get<DownloadsPoint>(base.api("downloads/point/last-week", name)));

const $DownloadsPointMonth: Record<string, DownloadsPoint> = {};
const getMonthDownloadsPoint = async (name: string): Promise<DownloadsPoint> =>
  ($DownloadsPointMonth[name] ??= await get<DownloadsPoint>(base.api("downloads/point/last-month", name)));

const $DownloadsRangeWeek: Record<string, DownloadsRange> = {};
const getWeekDownloadsRange = async (name: string): Promise<DownloadsRange> =>
  ($DownloadsRangeWeek[name] ??= await get<DownloadsRange>(base.api("downloads/range/last-week", name)));

const $DownloadsRangeMonth: Record<string, DownloadsRange> = {};
const getMonthDownloadsRange = async (name: string): Promise<DownloadsRange> =>
  ($DownloadsRangeMonth[name] ??= await get<DownloadsRange>(base.api("downloads/range/last-month", name)));

export type { Package, DownloadsPoint, DownloadsRange };
export { PackagenameSchema };
export { PackageSchema, DownloadsPointSchema, DownloadsRangeSchema };
export { getPackage, getWeekDownloadsPoint, getMonthDownloadsPoint, getWeekDownloadsRange, getMonthDownloadsRange };
