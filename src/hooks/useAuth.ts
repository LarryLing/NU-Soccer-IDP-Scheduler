import { useContext } from "react";
import type { AuthContextType } from "../lib/types.ts";
import { AuthContext } from "@/contexts/auth-context.tsx";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
