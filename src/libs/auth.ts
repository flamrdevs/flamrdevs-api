import { decode, sign, verify } from "hono/utils/jwt/jwt.ts";

import * as AUTH from "~/const/env/auth.ts";

import * as error from "~/libs/error.ts";

type Payload = {
  secret: string;
};

const handleDecode = (token?: unknown) => {
  if (typeof token !== "string") throw error.badRequest();
  return decode(token) as {
    header: Record<string | number | symbol, never>;
    payload: Payload;
  };
};

const handleSign = async (secret?: unknown) => {
  if (secret !== AUTH.SECRET) throw error.unauthorized();
  return await sign({ secret } satisfies Payload, AUTH.JWT_SECRET);
};

const handleVerify = async (token?: unknown) => {
  if (typeof token !== "string") throw error.badRequest();
  return (await verify(token, AUTH.JWT_SECRET)) as Payload;
};

export { handleDecode, handleSign, handleVerify };
