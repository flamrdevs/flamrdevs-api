import { hono } from "~/libs/exports.ts";

import { ENV } from "~/const/exports.ts";

const VALUE = `public, max-age=${ENV.__PROD__ ? "86400" : "0"}`;

export default hono.plugin<never>(() => {
  return async (c, next) => {
    await next();
    c.header("cache-control", VALUE);
  };
});
