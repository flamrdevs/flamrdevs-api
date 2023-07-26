import { fetch, valibot } from "~/libs/exports.ts";

const UsernameSchema = valibot.string([
  valibot.minLength(1, "Username must be at least 1 character long"),
  valibot.maxLength(39, "Username can be up to 39 characters long"),
  valibot.regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, "Invalid GitHub username"),
  valibot.regex(/^(?!.*-$)[\s\S]*$/, "Username cannot end with a hyphen"),
]);

const ReponameSchema = valibot.string([
  valibot.minLength(1, "Repository name must be at least 1 character long"),
  valibot.maxLength(100, "Repository name can be up to 100 characters long"),
  valibot.regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/, "Invalid repository name"),
  valibot.regex(/^(?!.*-$)[\s\S]*$/, "Repository name cannot end with a hyphen"),
]);

type User = valibot.Output<typeof UserSchema>;

const UserSchema = valibot.object({
  id: valibot.number(),
  name: valibot.string(),
  bio: valibot.optional(valibot.nullable(valibot.string())),
  followers: valibot.number(),
  following: valibot.number(),
});

type Org = valibot.Output<typeof OrgSchema>;

const OrgSchema = valibot.object({
  id: valibot.number(),
  name: valibot.string(),
  description: valibot.optional(valibot.nullable(valibot.string())),
  followers: valibot.number(),
  following: valibot.number(),
});

type Repo = valibot.Output<typeof RepoSchema>;

const RepoSchema = valibot.object({
  id: valibot.number(),
  name: valibot.string(),
  description: valibot.optional(valibot.nullable(valibot.string())),
  stargazers_count: valibot.number(),
});

const getUser = (username: string) => fetch.get<User>(`https://api.github.com/users/${username}`);
const getOrg = (org: string) => fetch.get<Org>(`https://api.github.com/orgs/${org}`);
const getRepo = (owner: string, repo: string) => fetch.get<Repo>(`https://api.github.com/repos/${owner}/${repo}`);

export type { User, Org, Repo };
export { UsernameSchema, ReponameSchema };
export { UserSchema, OrgSchema, RepoSchema };
export { getUser, getOrg, getRepo };
