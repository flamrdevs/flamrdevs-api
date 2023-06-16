import { Hono } from "https://deno.land/x/hono@v3.2.5/mod.ts";
import { cors, compress } from "https://deno.land/x/hono@v3.2.5/middleware.ts";

import * as HOST from "~/utils/host.ts";

const app = new Hono();

app.use("*", cors({ origin: "*" }));
app.use("*", compress());

app.get("/", (c) => {
  c.status(200);
  return c.json({
    message: "flamrdevs-api",
  });
});

app.get("/host", (c) => {
  c.status(200);
  return c.json({
    site: HOST.SITE(),
    static: HOST.STATIC(),
    web: HOST.WEB(),
    api: HOST.API(),
    image: HOST.IMAGE(),
  });
});

app.notFound((c) => {
  c.status(404);
  return c.json({
    message: "not found",
  });
});

export default app;
