import * as fetch from "~/libs/fetch.ts";
import zod from "~/libs/zod.ts";

const PackagenameSchema = zod
  .string()
  .regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, { message: "Invalid NPM package name" })
  .refine((value) => !value.endsWith("-"), { message: "Package name cannot end with a hyphen" });

type Package = zod.infer<typeof PackageSchema>;

const PackageSchema = zod.object({
  name: zod.string(),
  version: zod.string(),
  description: zod.string().optional(),
});

type DownloadsPoint = zod.infer<typeof DownloadsPointSchema>;

const DownloadsPointSchema = zod.object({
  package: zod.string(),
  start: zod.string(),
  end: zod.string(),
  downloads: zod.number(),
});

type DownloadsRange = zod.infer<typeof DownloadsRangeSchema>;

const DownloadsRangeSchema = zod.object({
  package: zod.string(),
  start: zod.string(),
  end: zod.string(),
  downloads: zod.array(
    zod.object({
      day: zod.string(),
      downloads: zod.number(),
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
