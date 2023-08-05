const CACHE = { "x-cache": "true" };

const NOCACHE = { "x-cache": "false" };

const cache = (is: boolean) => (is ? CACHE : NOCACHE);

export { cache };
