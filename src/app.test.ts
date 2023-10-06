Deno.env.set("MODE", "development");

import { assertEquals } from "std/assert/assert_equals.ts";

import * as v from "valibot/mod.ts";

import app from "~/app.ts";

import { parseUser, parseRepo } from "~/libs/github.ts";

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
    v: (fn: (value: unknown) => boolean) => (async (response) => assertEquals(fn(await response.json()), true)) satisfies FetchCallback,
  },
};

FETCH.GET(
  "/content/projects",
  200,
  callback.json.v((data) =>
    v.is(
      v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          slug: v.string(),
          site: v.optional(v.string()),
          repo: v.optional(v.string()),
          tags: v.array(v.string()),
        })
      ),
      data
    )
  )
);

FETCH.GET("/~/last", 200);

FETCH.GET(
  "/github/users/flamrdevs",
  200,
  callback.json.v((value) => {
    try {
      parseUser(value);
      return true;
    } catch {
      return false;
    }
  })
);
FETCH.GET(
  "/github/repos/flamrdevs/klass",
  200,
  callback.json.v((value) => {
    try {
      parseRepo(value);
      return true;
    } catch {
      return false;
    }
  })
);

FETCH.GET("/github/users/~flamrdevs", 400);
FETCH.GET("/github/repos/~flamrdevs/~klass", 400);

FETCH.GET("/", 200);
FETCH.GET("/not-found", 404);
