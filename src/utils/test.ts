import { assertEquals } from "std/assert/assert_equals.ts";

import { zod } from "~/libs/exports.ts";

const create = (res: Response, status: number) => {
  assertEquals(res.status, status);

  return {
    headers(object: Record<string, string | null>) {
      for (const key in object) assertEquals(res.headers.get(key), object[key]);
      return this;
    },
    content(type: "application/json; charset=UTF-8" | "image/svg+xml") {
      for (const [key, value] of res.headers.entries()) if (key.toLowerCase() === "content-type") assertEquals(value, type);
      return this;
    },
    async json(value: unknown) {
      assertEquals(await res.json(), value);
      return this;
    },
    zod<S extends zod.z.Schema>(this, schema: S) {
      const success = async (value?: unknown) => assertEquals((await schema.safeParseAsync(value)).success, true);
      return {
        headers: async () => {
          await success(Object.fromEntries(res.headers));
        },
        json: async () => {
          await success(await res.json());
        },
      };
    },
  };
};

const isOk = (res: Response) => create(res, 200);
const isBadRequest = (res: Response) => create(res, 400);
const isNotFound = (res: Response) => create(res, 404);

const isApplicationJSON = (instance: ReturnType<typeof create>, options: { cache: boolean }) => {
  instance.content("application/json; charset=UTF-8");
  instance.headers({ "x-cache": `${options.cache}` });
  return instance;
};

export { isOk, isBadRequest, isNotFound, isApplicationJSON };
