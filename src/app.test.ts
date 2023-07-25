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
      "/env": HOST.API("~/env"),
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

Deno.test("[route] GET /content", async () => {
  const res = isOk(await fetch.get("/content"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/projects": HOST.API("content/projects"),
    },
  });
});
Deno.test("[route] GET /content/projects", async () => {
  const res = isOk(await fetch.get("/content/projects"));
  res.content("application/json; charset=UTF-8");
});

Deno.test("[route] GET /github", async () => {
  const res = isOk(await fetch.get("/github"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/users/:username": HOST.API("github/users/:username"),
      "/orgs/:org": HOST.API("github/orgs/:org"),
      "/repos/:owner/:repo": HOST.API("github/repos/:owner/:repo"),
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

Deno.test("[route] GET /npm", async () => {
  const res = isOk(await fetch.get("/npm"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/~/:name{.+$}": HOST.API("npm/~/:name{.+$}"),
      "/dpw/:name{.+$}": HOST.API("npm/dpw/:name{.+$}"),
      "/dpm/:name{.+$}": HOST.API("npm/dpm/:name{.+$}"),
      "/drw/:name{.+$}": HOST.API("npm/drw/:name{.+$}"),
      "/drm/:name{.+$}": HOST.API("npm/drm/:name{.+$}"),
    },
  });
});
Deno.test("[route] GET /npm/~/@klass/core", async () => {
  const res = isOk(await fetch.get("/npm/~/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/npm/~/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /npm/dpw/@klass/core", async () => {
  const res = isOk(await fetch.get("/npm/dpw/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/npm/dpw/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /npm/dpm/@klass/core", async () => {
  const res = isOk(await fetch.get("/npm/dpm/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/npm/dpm/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /npm/drw/@klass/core", async () => {
  const res = isOk(await fetch.get("/npm/drw/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/npm/drw/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});
Deno.test("[route] GET /npm/drm/@klass/core", async () => {
  const res = isOk(await fetch.get("/npm/drm/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/npm/drm/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
});

Deno.test("[route] GET /bundlejs", async () => {
  const res = isOk(await fetch.get("/bundlejs"));
  res.content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/~/:name{.+$}": HOST.API("bundlejs/~/:name{.+$}"),
    },
  });
});
Deno.test("[route] GET /bundlejs/~/@klass/core", async () => {
  const res = isOk(await fetch.get("/bundlejs/~/@klass/core"));
  res.headers("x-cache", "false");
  res.content("application/json; charset=UTF-8");

  const res_cache = isOk(await fetch.get("/bundlejs/~/@klass/core"));
  res_cache.headers("x-cache", "true");
  res_cache.content("application/json; charset=UTF-8");
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
