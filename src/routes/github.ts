import { route, APIError } from "~/libs/hono.ts";
import { UsernameSchema, ReponameSchema, UserSchema, OrgSchema, RepoSchema, getUser, getOrg, getRepo } from "~/libs/github.ts";
import type { User, Org, Repo } from "~/libs/github.ts";
import cache from "~/libs/cache.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import { HEADERS, HOST } from "~/utils/exports.ts";

const UserParamSchema = zod.object({ username: UsernameSchema });
const UserCache = cache<User>();

const OrgParamSchema = zod.object({ org: ReponameSchema });
const OrgCache = cache<Org>();

const RepoParamSchema = zod.object({ owner: UsernameSchema, repo: ReponameSchema });
const RepoCache = cache<Repo>();

export default route((x) =>
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
      const parsedParam = await UserParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { username } = parsedParam.data;
        const key = username;

        const cached = UserCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await UserSchema.safeParseAsync(await getUser(username));

        if (parsedData.success) return c.json(UserCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/orgs/:org", async (c) => {
      const parsedParam = await OrgParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { org } = parsedParam.data;
        const key = org;

        const cached = OrgCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await OrgSchema.safeParseAsync(await getOrg(org));

        if (parsedData.success) return c.json(OrgCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/repos/:owner/:repo", async (c) => {
      const parsedParam = await RepoParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { owner, repo } = parsedParam.data;
        const key = `${owner}/${repo}`;

        const cached = RepoCache.get(key);
        if (typeof cached !== "undefined") return c.json(cached, 200, HEADERS.CACHE);

        const parsedData = await RepoSchema.safeParseAsync(await getRepo(owner, repo));

        if (parsedData.success) return c.json(RepoCache.set(key, parsedData.data), 200, HEADERS.NOCACHE);

        throw new APIError(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw new APIError(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
