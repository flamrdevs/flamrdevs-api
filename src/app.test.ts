Deno.env.set("MODE", "development");

import { HOST } from "~/utils/exports.ts";
import { isOk, isNotFound, isApplicationJSON } from "~/utils/test.ts";

import app from "~/app.ts";

const fetch = {
  get: (pathname: string) => app.request(pathname, { method: "GET" }),
};

Deno.test("[route] GET /~", async () => {
  const res = isOk(await fetch.get("/~")).content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/env": HOST.API("~/env"),
    },
  });
});
Deno.test("[route] GET /~/env", async () => {
  const res = isOk(await fetch.get("/~/env")).content("application/json; charset=UTF-8");
  await res.json({
    MODE: Deno.env.get("MODE"),
  });
});

Deno.test("[route] GET /content", async () => {
  const res = isOk(await fetch.get("/content")).content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/projects": HOST.API("content/projects"),
    },
  });
});
Deno.test("[route] GET /content/projects", async () => {
  isOk(await fetch.get("/content/projects")).content("application/json; charset=UTF-8");
});

Deno.test("[route] GET /github", async () => {
  const res = isOk(await fetch.get("/github")).content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/users/:username": HOST.API("github/users/:username"),
      "/orgs/:org": HOST.API("github/orgs/:org"),
      "/repos/:owner/:repo": HOST.API("github/repos/:owner/:repo"),
    },
  });
});
Deno.test("[route] GET /github/users/flamrdevs", async () => {
  isApplicationJSON(isOk(await fetch.get("/github/users/flamrdevs")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/github/users/flamrdevs")), { cache: true });
});
Deno.test("[route] GET /github/orgs/indonesia-api", async () => {
  isApplicationJSON(isOk(await fetch.get("/github/orgs/indonesia-api")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/github/orgs/indonesia-api")), { cache: true });
});
Deno.test("[route] GET /github/repos/flamrdevs/klass", async () => {
  isApplicationJSON(isOk(await fetch.get("/github/repos/flamrdevs/klass")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/github/repos/flamrdevs/klass")), { cache: true });
});

Deno.test("[route] GET /npm", async () => {
  const res = isOk(await fetch.get("/npm")).content("application/json; charset=UTF-8");
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
  isApplicationJSON(isOk(await fetch.get("/npm/~/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/npm/~/@klass/core")), { cache: true });
});
Deno.test("[route] GET /npm/dpw/@klass/core", async () => {
  isApplicationJSON(isOk(await fetch.get("/npm/dpw/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/npm/dpw/@klass/core")), { cache: true });
});
Deno.test("[route] GET /npm/dpm/@klass/core", async () => {
  isApplicationJSON(isOk(await fetch.get("/npm/dpm/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/npm/dpm/@klass/core")), { cache: true });
});
Deno.test("[route] GET /npm/drw/@klass/core", async () => {
  isApplicationJSON(isOk(await fetch.get("/npm/drw/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/npm/drw/@klass/core")), { cache: true });
});
Deno.test("[route] GET /npm/drm/@klass/core", async () => {
  isApplicationJSON(isOk(await fetch.get("/npm/drm/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/npm/drm/@klass/core")), { cache: true });
});

Deno.test("[route] GET /bundlejs", async () => {
  const res = isOk(await fetch.get("/bundlejs")).content("application/json; charset=UTF-8");
  await res.json({
    endpoints: {
      "/~/:name{.+$}": HOST.API("bundlejs/~/:name{.+$}"),
    },
  });
});
Deno.test("[route] GET /bundlejs/~/@klass/core", async () => {
  isApplicationJSON(isOk(await fetch.get("/bundlejs/~/@klass/core")), { cache: false });
  isApplicationJSON(isOk(await fetch.get("/bundlejs/~/@klass/core")), { cache: true });
});

Deno.test("[route] GET /", async () => {
  const res = isOk(await fetch.get("/"))
    .headers("x-me", "flamrdevs")
    .content("application/json; charset=UTF-8");
  await res.json({ name: "api" });
});
Deno.test("[route] GET /not-found", async () => {
  const res = isNotFound(await fetch.get("/not-found")).content("application/json; charset=UTF-8");
  await res.json({ message: "Not found" });
});
