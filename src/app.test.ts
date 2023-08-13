Deno.env.set("MODE", "development");

import { assertEquals } from "std/assert/assert_equals.ts";

import { z } from "zod/mod.ts";
import type { Schema } from "zod/mod.ts";

import app from "~/app.ts";

import { OrgSchema, RepoSchema, UserSchema } from "~/libs/github.ts";
import { BundleSchema } from "~/libs/bundlejs.ts";
import { DownloadsPointSchema, DownloadsRangeSchema, PackageSchema } from "~/libs/npm.ts";

type FetchCallback = (response: Response) => Promise<void>;

const FETCH = {
  GET: (pathname: string, status: number, callback?: FetchCallback) => {
    const input = `${pathname}`;

    Deno.test(`GET ${input}`, async () => {
      const res = await app.request(input, { method: "GET" });
      assertEquals(res.status, status);
      await callback?.(res);
    });
  },
};

const callback = {
  json: {
    schema: <S extends Schema>(schema: S) =>
      (async (response) => assertEquals((await schema.safeParseAsync(await response.json())).success, true)) satisfies FetchCallback,
  },
};

FETCH.GET(
  "/content/projects",
  200,
  callback.json.schema(
    z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        slug: z.string(),
        site: z.string().optional(),
        repo: z.string().optional(),
        tags: z.array(z.string()),
      })
    )
  )
);

FETCH.GET("/github/users/flamrdevs", 200, callback.json.schema(UserSchema));
FETCH.GET("/github/orgs/indonesia-api", 200, callback.json.schema(OrgSchema));
FETCH.GET("/github/repos/flamrdevs/klass", 200, callback.json.schema(RepoSchema));

FETCH.GET("/npm/~/@klass/core", 200, callback.json.schema(PackageSchema));
FETCH.GET("/npm/dpw/@klass/core", 200, callback.json.schema(DownloadsPointSchema));
FETCH.GET("/npm/dpm/@klass/core", 200, callback.json.schema(DownloadsPointSchema));
FETCH.GET("/npm/drw/@klass/core", 200, callback.json.schema(DownloadsRangeSchema));
FETCH.GET("/npm/drm/@klass/core", 200, callback.json.schema(DownloadsRangeSchema));

FETCH.GET("/bundlejs/~/@klass/core", 200, callback.json.schema(BundleSchema));

FETCH.GET("/github/users/~flamrdevs", 400);
FETCH.GET("/github/orgs/~indonesia-api", 400);
FETCH.GET("/github/repos/~flamrdevs/~klass", 400);

FETCH.GET("/npm/~/@klass/core-", 400);
FETCH.GET("/npm/dpw/@klass/core-", 400);
FETCH.GET("/npm/dpm/@klass/core-", 400);
FETCH.GET("/npm/drw/@klass/core-", 400);
FETCH.GET("/npm/drm/@klass/core-", 400);

FETCH.GET("/bundlejs/~/@klass/core-", 400);

FETCH.GET("/", 200);
FETCH.GET("/not-found", 404);
