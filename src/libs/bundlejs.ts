import * as fetch from "~/libs/fetch.ts";
import zod from "~/libs/zod.ts";

const PackagenameSchema = zod
  .string()
  .regex(/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, { message: "Invalid NPM package name" })
  .refine((value) => !value.endsWith("-"), { message: "Package name cannot end with a hyphen" });

type Package = zod.infer<typeof PackageSchema>;

const PackageSchema = zod.object({
  version: zod.string(),
  size: zod.object({
    type: zod.string(),
    rawUncompressedSize: zod.number(),
    uncompressedSize: zod.string(),
    rawCompressedSize: zod.number(),
    compressedSize: zod.string(),
    size: zod.string(),
  }),
});

const getPackage = (name: string) => fetch.get<Package>(`https://deno.bundlejs.com/?q=${name}`);

export type { Package };
export { PackagenameSchema };
export { PackageSchema };
export { getPackage };
