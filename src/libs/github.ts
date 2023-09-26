import { get } from "~/libs/fetch.ts";
import memo from "~/libs/memo.ts";

import * as err from "~/libs/err.ts";
import * as v from "~/libs/v.ts";

const regexpNoHyphen = /^(?!.*-$)[\s\S]*$/;

const regexpUsername = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;
const isUsername = (value: unknown): value is string =>
  v.is_string(value) && value.length > 0 && value.length < 40 && regexpUsername.test(value) && regexpNoHyphen.test(value);
const parseUsername = (value: unknown) => {
  if (isUsername(value)) return value;
  throw err.badRequest("Invalid GitHub username");
};

const regexpReponame = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,99}$/;
const isReponame = (value: unknown): value is string =>
  v.is_string(value) && value.length > 0 && value.length < 101 && regexpReponame.test(value) && regexpNoHyphen.test(value);
const parseReponame = (value: unknown) => {
  if (isReponame(value)) return value;
  throw err.badRequest("Invalid repository name");
};

type User = {
  id: number;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
};

const parseUser = (value: unknown) => {
  if (
    v.is_object(value) &&
    v.is_in_object_and_type("id", value, v.is_number) &&
    v.is_in_object_and_type("name", value, v.is_string_nullable) &&
    v.is_in_object_and_type("avatar_url", value, v.is_string) &&
    v.is_in_object_and_type("bio", value, v.is_string_nullable) &&
    v.is_in_object_and_type("followers", value, v.is_number) &&
    v.is_in_object_and_type("following", value, v.is_number)
  )
    return {
      id: value.id,
      name: value.name,
      avatar_url: value.avatar_url,
      bio: value.bio,
      followers: value.followers,
      following: value.following,
    } as User;
  throw err.badRequest("Invalid user");
};

type Repo = {
  id: number;
  name: string | null;
  description: string | null;
  stargazers_count: number;
};

const parseRepo = (value: unknown) => {
  if (
    v.is_object(value) &&
    v.is_in_object_and_type("id", value, v.is_number) &&
    v.is_in_object_and_type("name", value, v.is_string_nullable) &&
    v.is_in_object_and_type("description", value, v.is_string_nullable) &&
    v.is_in_object_and_type("stargazers_count", value, v.is_number)
  )
    return {
      id: value.id,
      name: value.name,
      description: value.description,
      stargazers_count: value.stargazers_count,
    } as Repo;
  throw err.badRequest("Invalid repo");
};

const base = (...paths: string[]) => ["https://api.github.com"].concat(paths).join("/");

const loadUser = memo<User>();
const getUser = (username: string): Promise<User> => loadUser(username, () => get<User>(base("users", username)));

const loadRepo = memo<Repo>();
const getRepo = (owner: string, repo: string): Promise<Repo> => loadRepo(`${owner}/${repo}`, () => get<Repo>(base("repos", owner, repo)));

export type { User, Repo };
export { parseUsername, parseReponame };
export { parseUser, parseRepo };
export { getUser, getRepo };
