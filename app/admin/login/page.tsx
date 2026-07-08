import { LoginForm } from "@/components/dashboard/LoginForm";
import { CONTAINER_PADDING } from "@/lib/constants/spacing";
import { cn } from "@/lib/utils/cn";

export default function AdminLoginPage() {
  return (
    <main className={cn(CONTAINER_PADDING, "flex min-h-screen items-center justify-center")}>
      <div className="w-full max-w-sm">
        <h1 className="text-center text-h2 font-bold text-foreground">Admin Login</h1>
        <p className="mt-2 text-center text-body text-muted-foreground">
          Sign in to manage bookings, payments, and content.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
