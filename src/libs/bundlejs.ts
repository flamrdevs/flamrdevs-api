import { z } from "zod/mod.ts";

import { get } from "~/libs/fetch.ts";

type Bundle = z.infer<typeof BundleSchema>;

const BundleSchema = z.object({
  version: z.string(),
  size: z.object({
    type: z.string(),
    rawUncompressedSize: z.number(),
    uncompressedSize: z.string(),
    rawCompressedSize: z.number(),
    compressedSize: z.string(),
    size: z.string(),
  }),
});

const base = (...paths: string[]) => ["https://deno.bundlejs.com"].concat(paths).join("/");

const $Bundle: Record<string, Bundle> = {};
const getBundle = async (name: string): Promise<Bundle> => ($Bundle[name] ??= await get<Bundle>(base(`?q=${name}`)));

export type { Bundle };
export { BundleSchema };
export { getBundle };
