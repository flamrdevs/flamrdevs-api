import { z, ZodError } from "zod/mod.ts";

const firstErrorMessage = <
  T extends {
    success: false;
    error: ZodError;
  }
>(
  safeParseError: T,
  fallbackMessage: string
) => safeParseError.error.issues?.at(0)?.message ?? fallbackMessage;

export { z, firstErrorMessage };
