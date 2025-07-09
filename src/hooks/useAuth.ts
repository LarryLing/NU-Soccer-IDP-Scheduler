import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.tsx";
import type { AuthContextType } from "../lib/types.ts";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
