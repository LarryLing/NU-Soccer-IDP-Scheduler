import SignUpCard from "@/components/authentication/signup-card";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: Signup,
});

function Signup() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUpCard />
    </div>
  );
}
