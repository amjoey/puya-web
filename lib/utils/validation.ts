import type { z } from "zod";

type FieldErrorResult = {
  success: false;
  error: string;
  fieldErrors: Record<string, string[] | undefined>;
};

// Wraps Zod's safeParse with the "please check the highlighted fields" +
// flattened fieldErrors shape used by every form-backed Server Action
// (booking, review, promotion). Previously re-typed identically at each
// call site; this is purely a DRY extraction, same shape and message.
export function parseFormInput<T>(
  schema: z.ZodType<T>,
  input: unknown,
): { success: true; data: T } | FieldErrorResult {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  return { success: true, data: parsed.data };
}
