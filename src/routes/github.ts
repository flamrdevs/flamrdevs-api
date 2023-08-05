import { github, hono, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const UserParamSchema = zod.z.object({ username: github.UsernameSchema });

const OrgParamSchema = zod.z.object({ org: github.ReponameSchema });

const RepoParamSchema = zod.z.object({ owner: github.UsernameSchema, repo: github.ReponameSchema });

export default hono.route((x) =>
  x

    .get("/", MIDDLEWARES.cache30D, (c) => {
      return c.json({
        endpoints: {
          "/users/:username": HOST.API("github/users/:username"),
          "/orgs/:org": HOST.API("github/orgs/:org"),
          "/repos/:owner/:repo": HOST.API("github/repos/:owner/:repo"),
        },
      });
    })

    .get("/users/:username", MIDDLEWARES.cache1D, async (c) => {
      const param = await UserParamSchema.parseAsync(c.req.param());

      const [cache, data] = await github.getUser(param.username);

      return c.json(await github.UserSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/orgs/:org", MIDDLEWARES.cache1D, async (c) => {
      const param = await OrgParamSchema.parseAsync(c.req.param());

      const [cache, data] = await github.getOrg(param.org);

      return c.json(await github.OrgSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })

    .get("/repos/:owner/:repo", MIDDLEWARES.cache1D, async (c) => {
      const param = await RepoParamSchema.parseAsync(c.req.param());

      const [cache, data] = await github.getRepo(param.owner, param.repo);

      return c.json(await github.RepoSchema.parseAsync(data), 200, cache ? HEADERS.CACHE : HEADERS.NOCACHE);
    })
);
