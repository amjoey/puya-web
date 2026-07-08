import { requireAdmin } from "@/lib/auth/session";
import type { PromotionFormInput } from "@/lib/validators/promotion.schema";
import {
  createPromotion as createPromotionRow,
  deletePromotion as deletePromotionRow,
  updatePromotion as updatePromotionRow,
} from "@/repositories/promotion.repository";
import type { Promotion } from "@/types/promotion";

function toRow(input: PromotionFormInput) {
  return {
    title: input.title,
    description: input.description || null,
    discount_type: input.discountType,
    discount_value: input.discountValue,
    start_date: input.startDate || null,
    end_date: input.endDate || null,
    active: input.active,
  };
}

// Admin Dashboard > Promotion Management — see PRD.md > 6. Promotions System.
export async function createPromotion(input: PromotionFormInput): Promise<Promotion> {
  await requireAdmin();
  return createPromotionRow(toRow(input));
}

export async function updatePromotion(
  id: string,
  input: PromotionFormInput,
): Promise<Promotion> {
  await requireAdmin();
  return updatePromotionRow(id, toRow(input));
}

export async function deletePromotion(id: string): Promise<void> {
  await requireAdmin();
  await deletePromotionRow(id);
}

export async function setPromotionActive(id: string, active: boolean): Promise<Promotion> {
  await requireAdmin();
  return updatePromotionRow(id, { active });
}
