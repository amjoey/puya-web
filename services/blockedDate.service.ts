import { requireAdmin } from "@/lib/auth/session";
import type { BlockedDateFormInput } from "@/lib/validators/blockedDate.schema";
import {
  createBlockedDate as createBlockedDateRow,
  deleteBlockedDate as deleteBlockedDateRow,
} from "@/repositories/blockedDate.repository";
import type { BlockedDate } from "@/types/blockedDate";

// Admin Dashboard > Calendar Management — see PRD.md.
export async function createBlockedDate(input: BlockedDateFormInput): Promise<BlockedDate> {
  await requireAdmin();
  return createBlockedDateRow({
    villa_id: input.villaId || null,
    blocked_date: input.blockedDate,
    reason: input.reason || null,
  });
}

export async function deleteBlockedDate(id: string): Promise<void> {
  await requireAdmin();
  await deleteBlockedDateRow(id);
}
