import { fetch, valibot } from "~/libs/exports.ts";

const PackagenameSchema = valibot.string([
  valibot.regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, "Invalid NPM package name"),
  valibot.regex(/^(?!.*-$)[\s\S]*$/, "Package name cannot end with a hyphen"),
]);

type Package = valibot.Output<typeof PackageSchema>;

const PackageSchema = valibot.object({
  name: valibot.string(),
  version: valibot.string(),
  description: valibot.optional(valibot.string()),
});

type DownloadsPoint = valibot.Output<typeof DownloadsPointSchema>;

const DownloadsPointSchema = valibot.object({
  package: valibot.string(),
  start: valibot.string(),
  end: valibot.string(),
  downloads: valibot.number(),
});

type DownloadsRange = valibot.Output<typeof DownloadsRangeSchema>;

const DownloadsRangeSchema = valibot.object({
  package: valibot.string(),
  start: valibot.string(),
  end: valibot.string(),
  downloads: valibot.array(
    valibot.object({
      day: valibot.string(),
      downloads: valibot.number(),
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
