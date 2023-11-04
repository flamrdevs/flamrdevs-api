Deno.env.set("MODE", "development");

import { assertEquals } from "std/assert/assert_equals.ts";

import * as v from "valibot/mod.ts";

import app from "~/app.ts";

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

const form = (obj: object) => {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => formData.append(key, value));
  return formData;
};

Deno.test(`Auth`, async () => {
  const res_sign = await app.request("/auth/sign", { method: "POST", body: form({ secret: "local-auth-secret" }) });
  assertEquals(res_sign.status, 200);
  const json_sign = await res_sign.json();
  const schema_json_sign = v.object({ token: v.string() });
  assertEquals(v.is(schema_json_sign, json_sign), true);
  const { token } = v.parse(schema_json_sign, json_sign);

  const res_verify = await app.request("/auth/verify", { method: "POST", body: form({ token }) });
  assertEquals(res_verify.status, 200);

  const res_decode = await app.request("/auth/decode", { method: "POST", body: form({ token }) });
  assertEquals(res_decode.status, 200);
});

FETCH.GET("/~/last", 200);

FETCH.GET("/", 200);
FETCH.GET(
  "/health",
  200,
  callback.json.v((value) => {
    const { success } = v.safeParse(
      v.object({
        ok: v.boolean(),
      }),
      value
    );
    return success;
  })
);
FETCH.GET("/not-found", 404);
