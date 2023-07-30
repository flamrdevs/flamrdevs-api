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
      const parsedParam = await UserParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { username } = parsedParam.data;
        const key = username;

        const cached = UserCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await github.UserSchema.safeParseAsync(await github.getUser(username));

        if (parsedData.success) return c.json(UserCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/orgs/:org", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await OrgParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { org } = parsedParam.data;
        const key = org;

        const cached = OrgCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await github.OrgSchema.safeParseAsync(await github.getOrg(org));

        if (parsedData.success) return c.json(OrgCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/repos/:owner/:repo", MIDDLEWARES.cache1D, async (c) => {
      const parsedParam = await RepoParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { owner, repo } = parsedParam.data;
        const key = `${owner}/${repo}`;

        const cached = RepoCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await github.RepoSchema.safeParseAsync(await github.getRepo(owner, repo));

        if (parsedData.success) return c.json(RepoCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, zod.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, zod.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
