import { fetch, zod } from "~/libs/exports.ts";

type Bundle = zod.z.infer<typeof BundleSchema>;

const BundleSchema = zod.z.object({
  version: zod.z.string(),
  size: zod.z.object({
    type: zod.z.string(),
    rawUncompressedSize: zod.z.number(),
    uncompressedSize: zod.z.string(),
    rawCompressedSize: zod.z.number(),
    compressedSize: zod.z.string(),
    size: zod.z.string(),
  }),
});

const getBundle = (name: string) => fetch.get<Bundle>(`https://deno.bundlejs.com/?q=${name}`);

export type { Bundle };
export { BundleSchema };
export { getBundle };
