import { apierror } from "~/libs/hono.ts";

type FetchOptions = {
  errMsg?: string;
};

const get = async <T>(url: string, { errMsg = "Failed to fetch" }: FetchOptions = {}) => {
  const response = await fetch(url);
  if (response.ok) return (await response.json()) as T;
  throw apierror(500, errMsg);
};

export { get };
