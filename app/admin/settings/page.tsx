import { redirect } from "next/navigation";

import { AdminShell } from "@/components/dashboard/AdminShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentAdmin } from "@/lib/auth/session";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

// Admin Dashboard > Settings — minimal profile view for now (no admin
// invite/role-management UI yet; see PROJECT_AUDIT.md).
export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell>
      <main className={cn(CONTAINER_PADDING, "py-8")}>
        <h1 className="text-h2 font-bold text-foreground">Settings</h1>
        <div className="mt-6 max-w-md">
          <Card>
            <CardHeader>
              <p className="text-body font-semibold text-foreground">Your Account</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-body text-muted-foreground">
              <p>
                <span className="text-foreground">Email:</span> {admin.email}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-foreground">Role:</span>
                <Badge variant="secondary">{admin.role}</Badge>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminShell>
  );
}
