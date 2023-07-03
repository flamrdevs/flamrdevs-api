Deno.env.set("MODE", "development");

import { isOk, isNotFound } from "~/utils/test.ts";

import * as HOST from "~/utils/host.ts";

import app from "~/app.ts";

const fetch = {
  get: (pathname: string) => app.request(pathname, { method: "GET" }),
};

Deno.test("[route] GET /~", async () => {
  const res = isOk(await fetch.get("/~"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/env": HOST.API("~", "env"),
    },
  });
});
Deno.test("[route] GET /~/env", async () => {
  const res = isOk(await fetch.get("/~/env"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    MODE: Deno.env.get("MODE"),
  });
});

Deno.test("[route] GET /github", async () => {
  const res = isOk(await fetch.get("/github"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/users/:username": HOST.API("users", ":username"),
      "/orgs/:org": HOST.API("orgs", ":org"),
      "/repos/:owner/:repo": HOST.API("repos", ":owner", ":repo"),
    },
  });
});
Deno.test("[route] GET /github/users/flamrdevs", async () => {
  const res = isOk(await fetch.get("/github/users/flamrdevs"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/github/users/flamrdevs"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /github/orgs/indonesia-api", async () => {
  const res = isOk(await fetch.get("/github/orgs/indonesia-api"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/github/orgs/indonesia-api"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /github/repos/flamrdevs/klass", async () => {
  const res = isOk(await fetch.get("/github/repos/flamrdevs/klass"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/github/repos/flamrdevs/klass"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});

Deno.test("[route] GET /projects", async () => {
  const res = isOk(await fetch.get("/projects"));
  res.content("application/json; charset=UTF-8");
});

Deno.test("[route] GET /", async () => {
  const res = isOk(await fetch.get("/"));
  res.headers("x-me", "flamrdevs");
  res.content("application/json; charset=UTF-8");
  await res.json({ name: "api" });
});
Deno.test("[route] GET /not-found", async () => {
  const res = isNotFound(await fetch.get("/not-found"));
  res.content("application/json; charset=UTF-8");
  await res.json({ message: "Not found" });
});
