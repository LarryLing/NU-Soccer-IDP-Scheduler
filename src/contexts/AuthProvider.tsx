import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserData } from "../lib/types.ts";
import { AuthContext } from "./AuthContext.tsx";
import supabase from "@/services/supabase.ts";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error || !user) {
        throw error;
      }

      setUser({
        id: user.id,
        email: user.email ?? "",
      });
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !user) {
        throw error;
      }

      setUser({
        id: user.id,
        email: user.email ?? "",
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error requesting password reset:", error);
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          throw error;
        }

        setUser({
          id: user.id,
          email: user.email ?? "",
        });
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signup,
      login,
      logout,
      requestPasswordReset,
      updatePassword,
    }),
    [
      user,
      isLoading,
      signup,
      login,
      logout,
      requestPasswordReset,
      updatePassword,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
