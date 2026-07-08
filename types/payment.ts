export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  slipImage: string | null;
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  remarks: string | null;
  createdAt: string;
}
