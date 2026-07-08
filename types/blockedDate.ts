// villaId === null means a global block (applies to every villa).
export interface BlockedDate {
  id: string;
  villaId: string | null;
  blockedDate: string;
  reason: string | null;
  createdAt: string;
}
