import type { ValiError } from "https://esm.sh/valibot@0.2.1";

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
} from "https://esm.sh/valibot@0.2.1";
export type { Output } from "https://esm.sh/valibot@0.2.1";
export { firstErrorMessage };
