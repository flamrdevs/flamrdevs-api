import { cache, fetch, zod } from "~/libs/exports.ts";

const PackagenameSchema = zod.z
  .string({ required_error: "Package name is required", invalid_type_error: "Package name must be a string" })
  .regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, { message: "Invalid NPM package name" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Package name cannot end with a hyphen" });

type Package = zod.z.infer<typeof PackageSchema>;

const PackageSchema = zod.z.object({
  name: zod.z.string(),
  version: zod.z.string(),
  description: zod.z.optional(zod.z.string()),
});

type DownloadsPoint = zod.z.infer<typeof DownloadsPointSchema>;

const DownloadsPointSchema = zod.z.object({
  package: zod.z.string(),
  start: zod.z.string(),
  end: zod.z.string(),
  downloads: zod.z.number(),
});

type DownloadsRange = zod.z.infer<typeof DownloadsRangeSchema>;

const DownloadsRangeSchema = zod.z.object({
  package: zod.z.string(),
  start: zod.z.string(),
  end: zod.z.string(),
  downloads: zod.z.array(
    zod.z.object({
      day: zod.z.string(),
      downloads: zod.z.number(),
    })
  ),
});

const PackageCache = cache.create<Package>();
const DownloadsPointWeekCache = cache.create<DownloadsPoint>();
const DownloadsPointMonthCache = cache.create<DownloadsPoint>();
const DownloadsRangeWeekCache = cache.create<DownloadsRange>();
const DownloadsRangeMonthCache = cache.create<DownloadsRange>();

const getPackage = async (name: string): Promise<[boolean, Package]> => {
  const cached = PackageCache.get(name);
  if (cached) return [true, cached];
  return [false, PackageCache.set(name, await fetch.get<Package>(`https://registry.npmjs.org/${name}/latest`))];
};
const getWeekDownloadsPoint = async (name: string): Promise<[boolean, DownloadsPoint]> => {
  const cached = DownloadsPointWeekCache.get(name);
  if (cached) return [true, cached];
  return [
    false,
    DownloadsPointWeekCache.set(name, await fetch.get<DownloadsPoint>(`https://api.npmjs.org/downloads/point/last-week/${name}`)),
  ];
};
const getMonthDownloadsPoint = async (name: string): Promise<[boolean, DownloadsPoint]> => {
  const cached = DownloadsPointMonthCache.get(name);
  if (cached) return [true, cached];
  return [
    false,
    DownloadsPointMonthCache.set(name, await fetch.get<DownloadsPoint>(`https://api.npmjs.org/downloads/point/last-month/${name}`)),
  ];
};
const getWeekDownloadsRange = async (name: string): Promise<[boolean, DownloadsRange]> => {
  const cached = DownloadsRangeWeekCache.get(name);
  if (cached) return [true, cached];
  return [
    false,
    DownloadsRangeWeekCache.set(name, await fetch.get<DownloadsRange>(`https://api.npmjs.org/downloads/range/last-week/${name}`)),
  ];
};
const getMonthDownloadsRange = async (name: string): Promise<[boolean, DownloadsRange]> => {
  const cached = DownloadsRangeMonthCache.get(name);
  if (cached) return [true, cached];
  return [
    false,
    DownloadsRangeMonthCache.set(name, await fetch.get<DownloadsRange>(`https://api.npmjs.org/downloads/range/last-month/${name}`)),
  ];
};

export type { Package, DownloadsPoint, DownloadsRange };
export { PackagenameSchema };
export { PackageSchema, DownloadsPointSchema, DownloadsRangeSchema };
export { getPackage, getWeekDownloadsPoint, getMonthDownloadsPoint, getWeekDownloadsRange, getMonthDownloadsRange };
