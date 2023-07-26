import { hono } from "~/libs/exports.ts";

type FetchOptions = {
  errMsg?: string;
};

const get = async <T>(url: string, { errMsg = "Failed to fetch" }: FetchOptions = {}) => {
  const response = await fetch(url);
  if (response.ok) return (await response.json()) as T;
  throw new hono.APIError(500, errMsg);
};

export { get };
