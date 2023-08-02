import { fetch, zod } from "~/libs/exports.ts";

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

const getPackage = (name: string) => fetch.get<Package>(`https://registry.npmjs.org/${name}/latest`);
const getWeekDownloadsPoint = (name: string) => fetch.get<DownloadsPoint>(`https://api.npmjs.org/downloads/point/last-week/${name}`);
const getMonthDownloadsPoint = (name: string) => fetch.get<DownloadsPoint>(`https://api.npmjs.org/downloads/point/last-month/${name}`);
const getWeekDownloadsRange = (name: string) => fetch.get<DownloadsRange>(`https://api.npmjs.org/downloads/range/last-week/${name}`);
const getMonthDownloadsRange = (name: string) => fetch.get<DownloadsRange>(`https://api.npmjs.org/downloads/range/last-month/${name}`);

export type { Package, DownloadsPoint, DownloadsRange };
export { PackagenameSchema };
export { PackageSchema, DownloadsPointSchema, DownloadsRangeSchema };
export { getPackage, getWeekDownloadsPoint, getMonthDownloadsPoint, getWeekDownloadsRange, getMonthDownloadsRange };
