import type { ValiError } from "valibot/mod.ts";

const firstErrorMessage = <
  T extends {
    success: false;
    error: ValiError;
  }
>(
  safeParseError: T,
  fallbackMessage: string
) => safeParseError.error.issues?.at(0)?.message ?? fallbackMessage;

export {
  string,
  number,
  boolean,
  object,
  array,
  endsWith,
  enumType,
  minLength,
  maxLength,
  nullable,
  optional,
  regex,
  useDefault,
  safeParseAsync,
} from "valibot/mod.ts";
export type { BaseSchema, BaseSchemaAsync, Output } from "valibot/mod.ts";
export { firstErrorMessage };
