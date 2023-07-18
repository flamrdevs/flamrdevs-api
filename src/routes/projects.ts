import { route, json } from "~/libs/hono.ts";

type Tag = "npm" | "preact" | "react" | "solid" | "svelte" | "vue";

interface IProject {
  name: string;
  description: string;
  slug: string;
  site?: string;
  repo?: string;
  tags?: Tag[];
}

const projects: IProject[] = [
  {
    name: "klass",
    description: "A class variant utility library",
    slug: "klass",
    site: "https://klass.pages.dev",
    repo: "https://github.com/flamrdevs/klass",
    tags: ["npm", "preact", "react", "solid"],
  },
  {
    name: "haaveersiinee",
    description: "Simple haversine",
    slug: "haaveersiinee",
    repo: "https://github.com/flamrdevs/haaveersiinee",
    tags: ["npm"],
  },
  {
    name: "hvrsn",
    description: "Simplest haversine",
    slug: "hvrsn",
    repo: "https://github.com/flamrdevs/hvrsn",
    tags: ["npm"],
  },
  {
    name: "apide",
    description: "api wrapper",
    slug: "apide",
    repo: "https://github.com/flamrdevs/apide",
    tags: ["npm"],
  },
  {
    name: "toodoo",
    description: "to-do api",
    slug: "toodoo",
    repo: "https://github.com/flamrdevs/toodoo",
    tags: ["npm"],
  },
  {
    name: "ixstore",
    description: "simple state management",
    slug: "ixstore",
    repo: "https://github.com/flamrdevs/ixstore",
    tags: ["npm"],
  },
  {
    name: "ixstorage",
    description: "simple storage",
    slug: "ixstorage",
    repo: "https://github.com/flamrdevs/ixstorage",
    tags: ["npm"],
  },
  {
    name: "ixstoragest",
    description: "simple state management with storage",
    slug: "ixstoragest",
    repo: "https://github.com/flamrdevs/ixstoragest",
    tags: ["npm"],
  },
  {
    name: "ixevent",
    description: "simple event emitter",
    slug: "ixevent",
    repo: "https://github.com/flamrdevs/ixevent",
    tags: ["npm"],
  },
  {
    name: "ixbroadcastr",
    description: "simple broadcast channel",
    slug: "ixbroadcastr",
    repo: "https://github.com/flamrdevs/ixbroadcastr",
    tags: ["npm"],
  },
];

export default route((x) =>
  x.get("/", (c) => {
    return json(c, 200, projects);
  })
);
