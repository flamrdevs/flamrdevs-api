import { z, ZodError } from "zod/mod.ts";

const isError = (value: unknown): value is ZodError => value instanceof ZodError;

const firstErrorMessage = (error: ZodError) => error.issues.at(0)?.message ?? "Bad request";

export { z, isError, firstErrorMessage };
