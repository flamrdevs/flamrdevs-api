import { route } from "~/libs/hono.ts";

import * as auth from "~/libs/auth.ts";
import * as error from "~/libs/error.ts";

export default route((x) =>
  x

    .post("/decode", async (ctx) => {
      return ctx.json(auth.handleDecode((await ctx.req.parseBody()).token));
    })

    .post("/sign", async (ctx) => {
      return ctx.json({ token: await auth.handleSign((await ctx.req.parseBody()).secret) });
    })

    .post("/verify", async (ctx) => {
      if (await auth.handleVerify((await ctx.req.parseBody()).token)) return ctx.json({ ok: true });
      throw error.unauthorized();
    })
);
