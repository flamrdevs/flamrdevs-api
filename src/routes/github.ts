import { route } from "~/libs/hono.ts";
import { UsernameSchema, ReponameSchema, UserSchema, RepoSchema, getUser, getRepo } from "~/libs/github.ts";

export default route((x) =>
  x

    .get("/users/:username", async (ctx) => {
      return ctx.json(await UserSchema.parseAsync(await getUser(await UsernameSchema.parseAsync(ctx.req.param("username")))));
    })

    .get("/repos/:owner/:repo", async (ctx) => {
      return ctx.json(
        await RepoSchema.parseAsync(
          await getRepo(await UsernameSchema.parseAsync(ctx.req.param("owner")), await ReponameSchema.parseAsync(ctx.req.param("repo")))
        )
      );
    })
);
