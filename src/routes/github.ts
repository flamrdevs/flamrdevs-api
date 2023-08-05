import { github, hono, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const UserParamSchema = zod.z.object({ username: github.UsernameSchema });

const OrgParamSchema = zod.z.object({ org: github.ReponameSchema });

const RepoParamSchema = zod.z.object({ owner: github.UsernameSchema, repo: github.ReponameSchema });

export default hono.route((x) =>
  x

    .get("/", MIDDLEWARES.cache30D, (ctx) => {
      return ctx.json({
        endpoints: {
          "/users/:username": HOST.API("github/users/:username"),
          "/orgs/:org": HOST.API("github/orgs/:org"),
          "/repos/:owner/:repo": HOST.API("github/repos/:owner/:repo"),
        },
      });
    })

    .get("/users/:username", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await UserParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await github.getUser(param.username);

      return ctx.json(await github.UserSchema.parseAsync(data), 200, HEADERS.cache(cache));
    })

    .get("/orgs/:org", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await OrgParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await github.getOrg(param.org);

      return ctx.json(await github.OrgSchema.parseAsync(data), 200, HEADERS.cache(cache));
    })

    .get("/repos/:owner/:repo", MIDDLEWARES.cache1D, async (ctx) => {
      const param = await RepoParamSchema.parseAsync(ctx.req.param());

      const [cache, data] = await github.getRepo(param.owner, param.repo);

      return ctx.json(await github.RepoSchema.parseAsync(data), 200, HEADERS.cache(cache));
    })
);
