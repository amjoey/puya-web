export type DiscountType = "percentage" | "fixed_amount";

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  createdAt: string;
}
