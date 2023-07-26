import { fetch } from "~/libs/exports.ts";
import zod from "~/libs/zod.ts";

const UsernameSchema = zod
  .string()
  .min(1, { message: "Username must be at least 1 character long" })
  .max(39, { message: "Username can be up to 39 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, { message: "Invalid GitHub username" })
  .refine((value) => !value.endsWith("-"), { message: "Username cannot end with a hyphen" });

const ReponameSchema = zod
  .string()
  .min(1, { message: "Repository name must be at least 1 character long" })
  .max(100, { message: "Repository name can be up to 100 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/, { message: "Invalid repository name" })
  .refine((value) => !value.endsWith("-"), { message: "Repository name cannot end with a hyphen" });

type User = zod.infer<typeof UserSchema>;

const UserSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  bio: zod.string().nullable().optional(),
  followers: zod.number(),
  following: zod.number(),
});

type Org = zod.infer<typeof OrgSchema>;

const OrgSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  description: zod.string().nullable().optional(),
  followers: zod.number(),
  following: zod.number(),
});

type Repo = zod.infer<typeof RepoSchema>;

const RepoSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  description: zod.string().nullable().optional(),
  stargazers_count: zod.number(),
});

const getUser = (username: string) => fetch.get<User>(`https://api.github.com/users/${username}`);
const getOrg = (org: string) => fetch.get<Org>(`https://api.github.com/orgs/${org}`);
const getRepo = (owner: string, repo: string) => fetch.get<Repo>(`https://api.github.com/repos/${owner}/${repo}`);

export type { User, Org, Repo };
export { UsernameSchema, ReponameSchema };
export { UserSchema, OrgSchema, RepoSchema };
export { getUser, getOrg, getRepo };
