import { cache, github, hono, zod } from "~/libs/exports.ts";

import { HEADERS, HOST, MIDDLEWARES } from "~/utils/exports.ts";

const UserParamSchema = zod.z.object({ username: github.UsernameSchema });
const UserCache = cache.create<github.User>();

const OrgParamSchema = zod.z.object({ org: github.ReponameSchema });
const OrgCache = cache.create<github.Org>();

const RepoParamSchema = zod.z.object({ owner: github.UsernameSchema, repo: github.ReponameSchema });
const RepoCache = cache.create<github.Repo>();

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

      const { username } = param;
      const key = username;

      const cached = UserCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await github.UserSchema.parseAsync(await github.getUser(username));

      return c.json(UserCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/orgs/:org", MIDDLEWARES.cache1D, async (c) => {
      const param = await OrgParamSchema.parseAsync(c.req.param());

      const { org } = param;
      const key = org;

      const cached = OrgCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await github.OrgSchema.parseAsync(await github.getOrg(org));

      return c.json(OrgCache.set(key, data), 200, HEADERS.NOCACHE);
    })

    .get("/repos/:owner/:repo", MIDDLEWARES.cache1D, async (c) => {
      const param = await RepoParamSchema.parseAsync(c.req.param());

      const { owner, repo } = param;
      const key = `${owner}/${repo}`;

      const cached = RepoCache.get(key);
      if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

      const data = await github.RepoSchema.parseAsync(await github.getRepo(owner, repo));

      return c.json(RepoCache.set(key, data), 200, HEADERS.NOCACHE);
    })
);
