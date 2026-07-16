"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { session } from "@/lib/session";
import { ownerService } from "@/services/owner.service";
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
    const cached = session.getUser();
    if (cached) {
      setUser(cached);
    }
    setReady(true);

    if (session.getToken()) {
      ownerService
        .profile()
        .then((res) => {
          const profile = res.data || res;
          if (profile && profile.name) {
            const updatedUser = {
              ...cached,
              name: profile.name,
              email: profile.email,
              contactNumber: profile.contactNumber,
              ownerProfile: profile,
            };
            setUser(updatedUser);
            const token = session.getToken();
            if (token) {
              session.set(token, updatedUser);
            }
          }
        })
        .catch(() => {});
    }
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
