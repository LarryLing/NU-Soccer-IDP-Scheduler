import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule")({
  component: Schedule,
});

function Schedule() {
  return <div className="p-2">Hello from About!</div>;
}
