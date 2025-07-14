import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NorthwesternLogo from "./northwestern-logo";
import { useAuth } from "@/hooks/useAuth.ts";
import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="w-full flex justify-between items-center sm:px-8 px-4 py-4 border-b">
      <div className="flex items-center gap-3">
        <NorthwesternLogo height={36} width={23.51} />
        <h3 className="text-2xl font-bold hidden sm:block text-nowrap">IDP Scheduler</h3>
      </div>
      <Button onClick={handleLogout}>
        <LogOutIcon />
        Sign Out
      </Button>
    </nav>
  );
}
