import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => (
  <>
    <Navbar />
    <main className="sm:px-8 px-4 py-4 flex flex-col gap-y-4">
      <Outlet />
      <Toaster position="bottom-left" richColors />
    </main>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
