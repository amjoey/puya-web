export type AdminRole = "admin" | "super_admin";

export interface Admin {
  id: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}
