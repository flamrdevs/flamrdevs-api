export const SECRET = Deno.env.get("AUTH_SECRET") ?? "local-auth-secret";
export const JWT_SECRET = Deno.env.get("AUTH_JWT_SECRET") ?? "local-auth-jwt-secret";
