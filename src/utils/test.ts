import { assertEquals } from "https://deno.land/std@0.195.0/testing/asserts.ts";

const create = (res: Response, status: number) => {
  assertEquals(res.status, status);

  return {
    headers(name: string, value: string | null) {
      assertEquals(res.headers.get(name), value);
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
  };
};

const isOk = (res: Response) => create(res, 200);
const isBadRequest = (res: Response) => create(res, 400);
const isNotFound = (res: Response) => create(res, 404);

const isApplicationJSON = (instance: ReturnType<typeof create>, options: { cache: boolean }) => {
  instance.content("application/json; charset=UTF-8");
  instance.headers("x-cache", `${options.cache}`);
  return instance;
};

export { isOk, isBadRequest, isNotFound, isApplicationJSON };
