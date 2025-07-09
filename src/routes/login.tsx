import LoginCard from "@/components/authentication/LoginCard";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" });
    }
  },
  component: Login,
});

function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoginCard />
    </div>
  );
}
