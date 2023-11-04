export type { Context } from "hono/mod.ts";

import { Context, Hono } from "hono/mod.ts";
import type { Next } from "hono/mod.ts";

import * as MODE from "~/const/env/mode.ts";

type Plugin = (context: Context, next: Next) => Promise<void | Response>;

const plugin = <T extends Record<PropertyKey, string | number | boolean>>(fn: (options?: T) => Plugin) => fn;

const route = (fn: (hono: Hono) => Hono) => {
  return fn(new Hono());
};

const cachePlugin = plugin(({ maxAge = 86400 }: { maxAge?: number } = {}) => {
  const value = `public, max-age=${MODE.PROD ? `${maxAge}` : "1"}`;
  return async (ctx, next) => {
    await next();
    ctx.header("cache-control", value);
  };
});

export { plugin, route };
export { cachePlugin };
