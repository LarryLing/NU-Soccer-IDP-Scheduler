import ForgotPasswordCard from "@/components/authentication/forgot-password-card";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <div className="flex h-screen items-center justify-center">
      <ForgotPasswordCard />
    </div>
  );
}
