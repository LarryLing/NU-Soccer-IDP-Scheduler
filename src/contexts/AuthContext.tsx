import { createContext } from "react";
import type { AuthContextType } from "../lib/types.ts";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
