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
//
// Uses `S extends z.ZodTypeAny` + `z.infer<S>` instead of `z.ZodType<T>`
// so TypeScript resolves the return type via the same inference path as
// `z.infer<typeof schema>` — this avoids a mismatch for `.default()` fields
// in Zod v3.22+ where the output type is `boolean` but `ZodType<T>` resolves
// T as `boolean | undefined`.
export function parseFormInput<S extends z.ZodTypeAny>(
  schema: S,
  input: unknown,
): { success: true; data: z.infer<S> } | FieldErrorResult {
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
