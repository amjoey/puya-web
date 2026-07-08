import { Sidebar } from "@/components/dashboard/Sidebar";

// Wraps every protected admin page (not the login page) with the sidebar
// nav. Applied per-page rather than in app/admin/layout.tsx so the login
// screen — which shares that layout — doesn't render admin chrome.
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
