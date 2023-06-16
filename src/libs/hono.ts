export type { Context } from "https://deno.land/x/hono@v3.2.5/mod.ts";
export { Hono } from "https://deno.land/x/hono@v3.2.5/mod.ts";
export { HTTPException } from "https://deno.land/x/hono@v3.2.5/http-exception.ts";
export { cors, compress } from "https://deno.land/x/hono@v3.2.5/middleware.ts";

import { Context } from "https://deno.land/x/hono@v3.2.5/mod.ts";

function headers(c: Context, record: Record<string, string>) {
  for (const name in record) c.header(name, record[name]);
  return c;
}

function json<T>(c: Context, status: number, object: T) {
  c.status(status);
  return c.json(object);
}

export { headers, json };
