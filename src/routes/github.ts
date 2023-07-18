import { route, headers, json, apierror } from "~/libs/hono.ts";
import { UsernameSchema, ReponameSchema, UserSchema, OrgSchema, RepoSchema } from "~/libs/github.ts";
import type { User, Org, Repo } from "~/libs/github.ts";
import cache from "~/libs/cache.ts";
import * as fetch from "~/libs/fetch.ts";
import zod, { firstErrorMessage } from "~/libs/zod.ts";

import * as HOST from "~/utils/host.ts";

const UserParamSchema = zod.object({ username: UsernameSchema });
const UserCache = cache<User>();

const OrgParamSchema = zod.object({ org: ReponameSchema });
const OrgCache = cache<Org>();

const RepoParamSchema = zod.object({ owner: UsernameSchema, repo: ReponameSchema });
const RepoCache = cache<Repo>();

export default route((x) =>
  x

    .get("/", (c) => {
      return json(c, 200, {
        endpoints: {
          "/users/:username": HOST.API("users", ":username"),
          "/orgs/:org": HOST.API("orgs", ":org"),
          "/repos/:owner/:repo": HOST.API("repos", ":owner", ":repo"),
        },
      });
    })

    .get("/users/:username", async (c) => {
      const parsedParam = await UserParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { username } = parsedParam.data;
        const key = [username].join("/");

        const cached = UserCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const data = await fetch.get<User>(`https://api.github.com/users/${username}`);
        const parsedData = await UserSchema.safeParseAsync(data);

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, UserCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/orgs/:org", async (c) => {
      const parsedParam = await OrgParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { org } = parsedParam.data;
        const key = [org].join("/");

        const cached = OrgCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const data = await fetch.get<Org>(`https://api.github.com/orgs/${org}`);
        const parsedData = await OrgSchema.safeParseAsync(data);

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, OrgCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })

    .get("/repos/:owner/:repo", async (c) => {
      const parsedParam = await RepoParamSchema.safeParseAsync(c.req.param());

      if (parsedParam.success) {
        const { owner, repo } = parsedParam.data;
        const key = [owner, repo].join("/");

        const cached = RepoCache.get(key);
        if (typeof cached !== "undefined") return json(headers(c, { "x-cache": "true" }), 200, cached);

        const data = await fetch.get<Repo>(`https://api.github.com/repos/${owner}/${repo}`);
        const parsedData = await RepoSchema.safeParseAsync(data);

        if (parsedData.success) return json(headers(c, { "x-cache": "false" }), 200, RepoCache.set(key, parsedData.data));

        throw apierror(400, firstErrorMessage(parsedData, "Invalid data"));
      }

      throw apierror(400, firstErrorMessage(parsedParam, "Invalid param"));
    })
);
