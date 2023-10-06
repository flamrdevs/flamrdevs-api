import * as v from "valibot/mod.ts";

import { get } from "~/libs/fetch.ts";
import memo from "~/libs/memo.ts";

const regexpNoHyphen = /^(?!.*-$)[\s\S]*$/;

const UsernameSchema = v.string("Invalid GitHub username", [
  v.maxLength(40),
  v.regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/),
  v.regex(regexpNoHyphen),
]);
const ReponameSchema = v.string("Invalid GitHub reponame", [
  v.maxLength(101),
  v.regex(/^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/),
  v.regex(regexpNoHyphen),
]);

const parseUsername = (input: unknown) => v.parse(UsernameSchema, input);
const parseReponame = (input: unknown) => v.parse(ReponameSchema, input);

type User = v.Output<typeof UserSchema>;

const UserSchema = v.object({
  id: v.number(),
  name: v.nullable(v.string()),
  avatar_url: v.string(),
  bio: v.nullable(v.string()),
  followers: v.number(),
  following: v.number(),
});

const parseUser = (input: unknown) => v.parse(UserSchema, input);

type Repo = v.Output<typeof RepoSchema>;

const RepoSchema = v.object({
  id: v.number(),
  name: v.nullable(v.string()),
  description: v.nullable(v.string()),
  stargazers_count: v.number(),
});

const parseRepo = (input: unknown) => v.parse(RepoSchema, input);

const base = (...paths: string[]) => ["https://api.github.com"].concat(paths).join("/");

const loadUser = memo<User>();
const getUser = (username: string): Promise<User> => loadUser(username, () => get<User>(base("users", username)));

const loadRepo = memo<Repo>();
const getRepo = (owner: string, repo: string): Promise<Repo> => loadRepo(`${owner}/${repo}`, () => get<Repo>(base("repos", owner, repo)));

export type { User, Repo };
export { UsernameSchema, ReponameSchema, UserSchema, RepoSchema };
export { parseUsername, parseReponame };
export { parseUser, parseRepo };
export { getUser, getRepo };
