"use server";

import { redirect } from "next/navigation";

import { UnauthorizedError } from "@/lib/auth/session";
import { toActionError } from "@/lib/utils/actionError";
import { parseFormInput } from "@/lib/utils/validation";
import { promotionFormSchema, type PromotionFormInput } from "@/lib/validators/promotion.schema";
import {
  createPromotion as createPromotionService,
  deletePromotion as deletePromotionService,
  setPromotionActive as setPromotionActiveService,
  updatePromotion as updatePromotionService,
} from "@/services/promotion.service";

export type PromotionFormResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

// Admin Dashboard > Promotion Management — see PRD.md > 6. Promotions System.
export async function createPromotion(input: PromotionFormInput): Promise<PromotionFormResult> {
  const parsed = parseFormInput(promotionFormSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  try {
    await createPromotionService(parsed.data);
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to create this promotion.", [UnauthorizedError]),
    };
  }

  redirect("/admin/promotions");
}

export async function updatePromotion(
  id: string,
  input: PromotionFormInput,
): Promise<PromotionFormResult> {
  const parsed = parseFormInput(promotionFormSchema, input);
  if (!parsed.success) {
    return parsed;
  }

  try {
    await updatePromotionService(id, parsed.data);
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to update this promotion.", [UnauthorizedError]),
    };
  }

  redirect("/admin/promotions");
}

export type PromotionActionResult = { success: true } | { success: false; error: string };

export async function deletePromotion(id: string): Promise<PromotionActionResult> {
  try {
    await deletePromotionService(id);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to delete this promotion.", [UnauthorizedError]),
    };
  }
}

export async function togglePromotionActive(
  id: string,
  active: boolean,
): Promise<PromotionActionResult> {
  try {
    await setPromotionActiveService(id, active);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: toActionError(error, "Unable to update this promotion.", [UnauthorizedError]),
    };
  }
}
