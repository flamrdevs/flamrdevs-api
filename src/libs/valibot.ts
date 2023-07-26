import type { ValiError } from "valibot";

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
} from "valibot";
export type { BaseSchema, BaseSchemaAsync, Output } from "valibot";
export { firstErrorMessage };
