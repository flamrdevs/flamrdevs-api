import { Hono, json } from "~/libs/hono.ts";

interface IProject {
  name: string;
  description: string;
  slug: string;
}

const projects: IProject[] = [
  {
    name: "klass",
    description: "A class variant utility library",
    slug: "klass",
  },
];

export default new Hono().get("/", (c) => {
  return json(c, 200, projects);
});
