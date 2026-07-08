import { z } from "zod";

// Admin Dashboard > Calendar Management > Block Dates — see PRD.md.
// villaId omitted/empty means a global block (applies to every villa) —
// see types/blockedDate.ts.
export const blockedDateFormSchema = z.object({
  villaId: z.string().uuid().optional().or(z.literal("")),
  blockedDate: z.string().date(),
  reason: z.string().trim().max(255).optional().or(z.literal("")),
});

export type BlockedDateFormInput = z.infer<typeof blockedDateFormSchema>;
