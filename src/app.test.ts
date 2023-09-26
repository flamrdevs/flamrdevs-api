Deno.env.set("MODE", "development");

import { assertEquals } from "std/assert/assert_equals.ts";

import * as v from "~/libs/v.ts";

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
  callback.json.v(
    (data) =>
      Array.isArray(data) &&
      data.every(
        (element) =>
          v.is_object(element) &&
          v.is_in_object_and_type("name", element, v.is_string) &&
          v.is_in_object_and_type("description", element, v.is_string) &&
          v.is_in_object_and_type("slug", element, v.is_string) &&
          v.is_optional_in_object_and_type("site", element, v.is_string) &&
          v.is_optional_in_object_and_type("repo", element, v.is_string) &&
          v.is_in_object_and_type("tags", element, v.is_array) &&
          v.is_every(element.tags, v.is_string)
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
