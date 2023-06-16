import { plugin } from "~/libs/hono.ts";

import { __PROD__ } from "~/const/env.ts";

const VALUE = `public, max-age=${__PROD__ ? "86400" : "0"}`;

export default plugin<never>(() => {
  return async (c, next) => {
    await next();
    c.header("cache-control", VALUE);
  };
});
