import { fetch, valibot } from "~/libs/exports.ts";

type Bundle = valibot.Output<typeof BundleSchema>;

const BundleSchema = valibot.object({
  version: valibot.string(),
  size: valibot.object({
    type: valibot.string(),
    rawUncompressedSize: valibot.number(),
    uncompressedSize: valibot.string(),
    rawCompressedSize: valibot.number(),
    compressedSize: valibot.string(),
    size: valibot.string(),
  }),
});

const getBundle = (name: string) => fetch.get<Bundle>(`https://deno.bundlejs.com/?q=${name}`);

export type { Bundle };
export { BundleSchema };
export { getBundle };
