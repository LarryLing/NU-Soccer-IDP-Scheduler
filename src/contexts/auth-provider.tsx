import { type PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import type { UserData } from "../lib/types.ts";
import supabase from "@/services/supabase.ts";
import { AuthContext } from "@/contexts/auth-context.tsx";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const signup = useCallback(async (email: string, password: string) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error || !user) throw error;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !user) throw error;
    setUser({
      id: user.id,
      email: user.email ?? "",
    });
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) throw error;
        setUser({
          id: user.id,
          email: user.email ?? "",
        });
      } catch {
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
      resetPassword,
    }),
    [user, isLoading, signup, login, logout, requestPasswordReset, resetPassword],
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}
