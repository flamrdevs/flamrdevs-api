import { hono } from "~/libs/exports.ts";

import { ENV } from "~/const/exports.ts";

export default hono.plugin(({ maxAge = 86400 }: { maxAge?: number } = {}) => {
  const VALUE = `public, max-age=${ENV.__PROD__ ? `${maxAge}` : "0"}`;
  return async (c, next) => {
    await next();
    c.header("cache-control", VALUE);
  };
});
