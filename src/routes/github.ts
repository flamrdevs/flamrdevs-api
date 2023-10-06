import { route, cachePlugin } from "~/libs/hono.ts";
import { parseUsername, parseReponame, parseUser, parseRepo, getUser, getRepo } from "~/libs/github.ts";

export default route((x) =>
  x
    .use("*", cachePlugin())

    .get("/users/:username", async (ctx) => {
      return ctx.json(parseUser(await getUser(parseUsername(ctx.req.param("username")))));
    })

    .get("/repos/:owner/:repo", async (ctx) => {
      return ctx.json(parseRepo(await getRepo(parseUsername(ctx.req.param("owner")), parseReponame(ctx.req.param("repo")))));
    })
);
