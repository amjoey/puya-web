export interface Villa {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  capacity: number;
  weekdayPrice: number;
  weekendPrice: number;
  coverImage: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
