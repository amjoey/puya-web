"use server";

import { UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import {
  blockedDateFormSchema,
  type BlockedDateFormInput,
} from "@/lib/validators/blockedDate.schema";
import {
  createBlockedDate as createBlockedDateService,
  deleteBlockedDate as deleteBlockedDateService,
} from "@/services/blockedDate.service";

export type BlockedDateActionResult = { success: true } | { success: false; error: string };

// Admin Dashboard > Calendar Management > Block/Unblock Dates — see PRD.md.
export async function createBlockedDate(
  input: BlockedDateFormInput,
): Promise<BlockedDateActionResult> {
  const parsed = blockedDateFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the highlighted fields." };
  }

  try {
    await createBlockedDateService(parsed.data);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to block this date.", [UnauthorizedError]),
    };
  }
}

export async function deleteBlockedDate(id: string): Promise<BlockedDateActionResult> {
  try {
    await deleteBlockedDateService(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to unblock this date.", [UnauthorizedError]),
    };
  }
}
