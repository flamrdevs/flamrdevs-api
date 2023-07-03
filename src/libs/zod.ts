import { z as zod } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import type { SafeParseError } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const firstErrorMessage = <T>(safeParseError: SafeParseError<T>, fallbackMessage: string) =>
  safeParseError.error.errors.at(0)?.message ?? fallbackMessage;

export { firstErrorMessage };
export default zod;
