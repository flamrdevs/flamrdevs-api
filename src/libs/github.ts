import { fetch, zod } from "~/libs/exports.ts";

const UsernameSchema = zod.z
  .string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  })
  .min(1, { message: "Username must be at least 1 character long" })
  .max(39, { message: "Username can be up to 39 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, { message: "Invalid GitHub username" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Username cannot end with a hyphen" });

const ReponameSchema = zod.z
  .string({
    required_error: "Repository name is required",
    invalid_type_error: "Repository name must be a string",
  })
  .min(1, { message: "Repository name must be at least 1 character long" })
  .max(100, { message: "Repository name can be up to 100 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/, { message: "Invalid repository name" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Repository name cannot end with a hyphen" });

type User = zod.z.infer<typeof UserSchema>;

const UserSchema = zod.z.object({
  id: zod.z.number(),
  name: zod.z.string(),
  bio: zod.z.optional(zod.z.nullable(zod.z.string())),
  followers: zod.z.number(),
  following: zod.z.number(),
});

type Org = zod.z.infer<typeof OrgSchema>;

const OrgSchema = zod.z.object({
  id: zod.z.number(),
  name: zod.z.string(),
  description: zod.z.optional(zod.z.nullable(zod.z.string())),
  followers: zod.z.number(),
  following: zod.z.number(),
});

type Repo = zod.z.infer<typeof RepoSchema>;

const RepoSchema = zod.z.object({
  id: zod.z.number(),
  name: zod.z.string(),
  description: zod.z.optional(zod.z.nullable(zod.z.string())),
  stargazers_count: zod.z.number(),
});

const getUser = (username: string) => fetch.get<User>(`https://api.github.com/users/${username}`);
const getOrg = (org: string) => fetch.get<Org>(`https://api.github.com/orgs/${org}`);
const getRepo = (owner: string, repo: string) => fetch.get<Repo>(`https://api.github.com/repos/${owner}/${repo}`);

export type { User, Org, Repo };
export { UsernameSchema, ReponameSchema };
export { UserSchema, OrgSchema, RepoSchema };
export { getUser, getOrg, getRepo };
