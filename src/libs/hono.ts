export type { Context } from "hono/mod.ts";

import { Context, Hono } from "hono/mod.ts";
import type { Next } from "hono/mod.ts";

const create = () => new Hono();

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

export { create, plugin, route };
export { APIError };
