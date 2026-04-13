import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const ADMIN_AUTH_KEY = "readmart_admin_authenticated";

type AdminAuthContextValue = {
  isAdminAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  });

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAdminAuthenticated,
      login: (email: string, password: string) => {
        const canLogin = email.trim().length > 0 && password.trim().length > 0;

        if (!canLogin) {
          return false;
        }

        setIsAdminAuthenticated(true);
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        return true;
      },
      logout: () => {
        setIsAdminAuthenticated(false);
        localStorage.removeItem(ADMIN_AUTH_KEY);
      },
    }),
    [isAdminAuthenticated],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}
