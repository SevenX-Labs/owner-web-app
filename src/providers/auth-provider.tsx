"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { session } from "@/lib/session";
import type { Owner } from "@/types";
type AuthState = {
  user: Owner | null;
  ready: boolean;
  setSession: (token: string, user: Owner) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Owner | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setUser(session.getUser());
    setReady(true);
  }, []);
  const setSession = (token: string, next: Owner) => {
    session.set(token, next);
    setUser(next);
  };
  const logout = () => {
    session.clear();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, ready, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
};
