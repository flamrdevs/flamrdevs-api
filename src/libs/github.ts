import { z } from "zod/mod.ts";

import { get } from "~/libs/fetch.ts";
import memo from "~/libs/memo.ts";

const UsernameSchema = z
  .string({ required_error: "Username is required", invalid_type_error: "Username must be a string" })
  .min(1, { message: "Username must be at least 1 character long" })
  .max(39, { message: "Username can be up to 39 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/, { message: "Invalid GitHub username" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Username cannot end with a hyphen" });

const ReponameSchema = z
  .string({ required_error: "Repository name is required", invalid_type_error: "Repository name must be a string" })
  .min(1, { message: "Repository name must be at least 1 character long" })
  .max(100, { message: "Repository name can be up to 100 characters long" })
  .regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/, { message: "Invalid repository name" })
  .regex(/^(?!.*-$)[\s\S]*$/, { message: "Repository name cannot end with a hyphen" });

type User = z.infer<typeof UserSchema>;

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  bio: z.optional(z.nullable(z.string())),
  followers: z.number(),
  following: z.number(),
});

type Org = z.infer<typeof OrgSchema>;

const OrgSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.optional(z.nullable(z.string())),
  followers: z.number(),
  following: z.number(),
});

type Repo = z.infer<typeof RepoSchema>;

const RepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.optional(z.nullable(z.string())),
  stargazers_count: z.number(),
});

const base = (...paths: string[]) => ["https://api.github.com"].concat(paths).join("/");

const loadUser = memo<User>();
const getUser = (username: string): Promise<User> => loadUser(username, () => get<User>(base("users", username)));

const loadOrg = memo<Org>();
const getOrg = (org: string): Promise<Org> => loadOrg(org, () => get<Org>(base("orgs", org)));

const loadRepo = memo<Repo>();
const getRepo = (owner: string, repo: string): Promise<Repo> => loadRepo(`${owner}/${repo}`, () => get<Repo>(base("repos", owner, repo)));

export type { User, Org, Repo };
export { UsernameSchema, ReponameSchema };
export { UserSchema, OrgSchema, RepoSchema };
export { getUser, getOrg, getRepo };
