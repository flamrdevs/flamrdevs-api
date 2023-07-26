export { Hono } from "https://deno.land/x/hono@v3.3.3/mod.ts";
export type { Context } from "https://deno.land/x/hono@v3.3.3/mod.ts";

import { Context, Hono } from "https://deno.land/x/hono@v3.3.3/mod.ts";
import type { Next } from "https://deno.land/x/hono@v3.3.3/mod.ts";

type Plugin = (context: Context, next: Next) => Promise<void | Response>;

const plugin = <T extends Record<PropertyKey, never> = Record<PropertyKey, never>>(fn: (options?: T) => Plugin) => fn;

const route = (fn: (hono: Hono) => Hono) => {
  return fn(new Hono());
};

class APIError {
  constructor(public status: number, public message: string) {}

  static is(value: unknown): value is APIError {
    return value instanceof APIError;
  }
}

export { plugin, route };
export { APIError };
