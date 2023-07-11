export { Hono } from "https://deno.land/x/hono@v3.3.0/mod.ts";
export type { Context } from "https://deno.land/x/hono@v3.3.0/mod.ts";

import { Context } from "https://deno.land/x/hono@v3.3.0/mod.ts";
import type { Next } from "https://deno.land/x/hono@v3.3.0/mod.ts";

type Plugin = (context: Context, next: Next) => Promise<void | Response>;

const plugin = <T extends Record<PropertyKey, never> = Record<PropertyKey, never>>(fn: (options?: T) => Plugin) => fn;

function headers(c: Context, record: Record<string, string>) {
  for (const name in record) c.header(name, record[name]);
  return c;
}

function json<T>(c: Context, status: number, object: T) {
  c.status(status);
  return c.json(object);
}

class APIError {
  constructor(public status: number, public message: string) {}
}

const isAPIError = (value: unknown): value is APIError => value instanceof APIError;
const apierror = (status: number, message: string) => new APIError(status, message);

export { plugin };
export { headers, json };
export { APIError, isAPIError, apierror };
