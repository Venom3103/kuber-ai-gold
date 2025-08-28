// app/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; email: string } | null;

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  setUser: (u: User) => void;
}>({
  user: null,
  loading: true,
  setUser: () => {},
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        setUser(data.user || null);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
