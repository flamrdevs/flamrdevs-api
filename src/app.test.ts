Deno.env.set("MODE", "development");

import { assertEquals } from "std/assert/assert_equals.ts";

import app from "~/app.ts";

const FETCH = {
  GET: (pathname: string, status: number, callback?: (response: Response) => Promise<void>) => {
    const input = `${pathname}`;

    Deno.test(`GET ${input}`, async () => {
      const res = await app.request(input, { method: "GET" });
      assertEquals(res.status, status);
      await callback?.(res);
    });
  },
};

FETCH.GET("/content/projects", 200);

FETCH.GET("/github/users/flamrdevs", 200);
FETCH.GET("/github/orgs/indonesia-api", 200);
FETCH.GET("/github/repos/flamrdevs/klass", 200);

FETCH.GET("/npm/~/@klass/core", 200);
FETCH.GET("/npm/dpw/@klass/core", 200);
FETCH.GET("/npm/dpm/@klass/core", 200);
FETCH.GET("/npm/drw/@klass/core", 200);
FETCH.GET("/npm/drm/@klass/core", 200);

FETCH.GET("/bundlejs/~/@klass/core", 200);

FETCH.GET("/", 200);
FETCH.GET("/not-found", 404);
