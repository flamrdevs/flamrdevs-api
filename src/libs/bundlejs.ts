import { fetch } from "~/libs/exports.ts";
import zod from "~/libs/zod.ts";

type Bundle = zod.infer<typeof BundleSchema>;

const BundleSchema = zod.object({
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

const getBundle = (name: string) => fetch.get<Bundle>(`https://deno.bundlejs.com/?q=${name}`);

export type { Bundle };
export { BundleSchema };
export { getBundle };
