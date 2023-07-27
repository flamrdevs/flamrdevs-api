type Tag =
  | "astro"
  | "cloudflare-pages"
  | "deno"
  | "fastify"
  | "hono"
  | "netlify"
  | "node"
  | "npm"
  | "preact"
  | "react"
  | "solid"
  | "svelte"
  | "tailwindcss"
  | "turborepo"
  | "vanilla-extract"
  | "vercel"
  | "vue";

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
    name: "flamrdevs-home",
    description: "primary apps",
    slug: "flamrdevs-home",
    repo: "https://github.com/flamrdevs/flamrdevs-home",
    tags: ["astro", "netlify", "solid", "turborepo", "vanilla-extract", "vercel"],
  },
  {
    name: "flamrdevs-static",
    description: "static app",
    slug: "flamrdevs-static",
    repo: "https://github.com/flamrdevs/flamrdevs-static",
    tags: ["astro", "cloudflare-pages", "solid", "tailwindcss"],
  },
  {
    name: "flamrdevs-api",
    description: "api app",
    slug: "flamrdevs-api",
    repo: "https://github.com/flamrdevs/flamrdevs-api",
    tags: ["deno", "hono"],
  },
  {
    name: "flamrdevs-image",
    description: "image app",
    slug: "flamrdevs-image",
    repo: "https://github.com/flamrdevs/flamrdevs-image",
    tags: ["fastify", "node"],
  },
  {
    name: "klass",
    description: "A class variant utility library",
    slug: "klass",
    site: "https://klass.pages.dev",
    repo: "https://github.com/flamrdevs/klass",
    tags: ["npm", "preact", "react", "solid"],
  },
  {
    name: "ixclone",
    description: "simple state management",
    slug: "ixclone",
    repo: "https://github.com/flamrdevs/ixclone",
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
  {
    name: "hvrsn",
    description: "Simplest haversine",
    slug: "hvrsn",
    repo: "https://github.com/flamrdevs/hvrsn",
    tags: ["npm"],
  },
  {
    name: "haaveersiinee",
    description: "Simple haversine",
    slug: "haaveersiinee",
    repo: "https://github.com/flamrdevs/haaveersiinee",
    tags: ["npm"],
  },
];

export { projects };
