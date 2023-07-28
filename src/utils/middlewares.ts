import { cache } from "~/libs/@hono/middlewares.ts";

const cache1DOpts = { maxAge: 86400 };
const cache30DOpts = { maxAge: 86400 * 30 };

const cache1D = cache(cache1DOpts);
const cache30D = cache(cache30DOpts);

export { cache1DOpts, cache30DOpts, cache1D, cache30D };
