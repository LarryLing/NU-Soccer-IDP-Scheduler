import Navbar from "@/components/misc/navbar";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1">
        <h3>Welcome Home!</h3>
      </div>
    </div>
  );
}
