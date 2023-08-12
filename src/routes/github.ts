import { route } from "~/libs/hono.ts";
import { UsernameSchema, ReponameSchema, UserSchema, OrgSchema, RepoSchema, getUser, getOrg, getRepo } from "~/libs/github.ts";

export default route((x) =>
  x

    .get("/users/:username", async (ctx) => {
      return ctx.json(await UserSchema.parseAsync(await getUser(await UsernameSchema.parseAsync(ctx.req.param("username")))));
    })

    .get("/orgs/:org", async (ctx) => {
      return ctx.json(await OrgSchema.parseAsync(await getOrg(await UsernameSchema.parseAsync(ctx.req.param("org")))));
    })

    .get("/repos/:owner/:repo", async (ctx) => {
      return ctx.json(
        await RepoSchema.parseAsync(
          await getRepo(await UsernameSchema.parseAsync(ctx.req.param("owner")), await ReponameSchema.parseAsync(ctx.req.param("repo")))
        )
      );
    })
);
