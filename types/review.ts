export interface Review {
  id: string;
  villaId: string;
  customerName: string;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
  approved: boolean;
  createdAt: string;
}
