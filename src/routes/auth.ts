import { decode, sign, verify } from "hono/utils/jwt/jwt.ts";

import { route } from "~/libs/hono.ts";

import * as err from "~/libs/err.ts";

const AUTH_KEY = Deno.env.get("AUTH_KEY") ?? "local-auth-key";
const JWT_SECRET = Deno.env.get("JWT_SECRET") ?? "local-jwt-secret";

export default route((x) =>
  x

    .post("/decode", async (ctx) => {
      const { token } = await ctx.req.parseBody();
      if (typeof token !== "string") throw err.badRequest();
      return ctx.json(decode(token));
    })

    .post("/sign", async (ctx) => {
      const { key } = await ctx.req.parseBody();
      if (key !== AUTH_KEY) throw err.unauthorized();
      return ctx.json({ token: await sign({ key }, JWT_SECRET) });
    })

    .post("/verify", async (ctx) => {
      const { token } = await ctx.req.parseBody();
      if (typeof token !== "string") throw err.badRequest();
      if (await verify(token, JWT_SECRET)) return ctx.json({ ok: true });
      throw err.unauthorized();
    })
);
