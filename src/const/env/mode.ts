export const DEV = Deno.env.get("MODE") === "development";
export const PROD = Deno.env.get("MODE") === "production";
