import { cache, github, hono, valibot } from "~/libs/exports.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const UserParamSchema = valibot.object({ username: github.UsernameSchema });
const UserCache = cache.create<github.User>();

const OrgParamSchema = valibot.object({ org: github.ReponameSchema });
const OrgCache = cache.create<github.Org>();

const RepoParamSchema = valibot.object({ owner: github.UsernameSchema, repo: github.ReponameSchema });
const RepoCache = cache.create<github.Repo>();

export default hono.route((x) =>
  x

    .get("/", (c) => {
      return c.json({
        endpoints: {
          "/users/:username": HOST.API("github/users/:username"),
          "/orgs/:org": HOST.API("github/orgs/:org"),
          "/repos/:owner/:repo": HOST.API("github/repos/:owner/:repo"),
        },
      });
    })

    .get("/users/:username", async (c) => {
      const parsedParam = await valibot.safeParseAsync(UserParamSchema, c.req.param());

      if (parsedParam.success) {
        const { username } = parsedParam.data;
        const key = username;

        const cached = UserCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(github.UserSchema, await github.getUser(username));

        if (parsedData.success) return c.json(UserCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/orgs/:org", async (c) => {
      const parsedParam = await valibot.safeParseAsync(OrgParamSchema, c.req.param());

      if (parsedParam.success) {
        const { org } = parsedParam.data;
        const key = org;

        const cached = OrgCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(github.OrgSchema, await github.getOrg(org));

        if (parsedData.success) return c.json(OrgCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/repos/:owner/:repo", async (c) => {
      const parsedParam = await valibot.safeParseAsync(RepoParamSchema, c.req.param());

      if (parsedParam.success) {
        const { owner, repo } = parsedParam.data;
        const key = `${owner}/${repo}`;

        const cached = RepoCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await valibot.safeParseAsync(github.RepoSchema, await github.getRepo(owner, repo));

        if (parsedData.success) return c.json(RepoCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new hono.APIError(400, valibot.firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new hono.APIError(400, valibot.firstErrorMessage(parsedParam, "Invalid param"));
    })
);
