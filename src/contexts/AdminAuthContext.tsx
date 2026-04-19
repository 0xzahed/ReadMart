"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const ADMIN_LOGIN_ENDPOINT = "/auth/admin/login";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const ADMIN_AUTH_TOKEN_KEY = "readmart_admin_access_token";
const ADMIN_AUTH_PROFILE_KEY = "readmart_admin_profile";

export type AdminProfile = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

type AdminLoginApiResponse = {
  message?: string;
  status?: boolean;
  data?: {
    accessToken?: string;
    admin?: AdminProfile;
  };
};

type LoginResult = {
  ok: boolean;
  message?: string;
};

type StoredAdminAuth = {
  accessToken: string | null;
  admin: AdminProfile | null;
};

type AdminAuthContextValue = {
  isAdminAuthenticated: boolean;
  accessToken: string | null;
  admin: AdminProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

const getStoredAuthState = (): StoredAdminAuth => {
  if (typeof window === "undefined") {
    return { accessToken: null, admin: null };
  }

  const accessToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  if (!accessToken) {
    localStorage.removeItem(ADMIN_AUTH_PROFILE_KEY);
    return { accessToken: null, admin: null };
  }

  const rawAdmin = localStorage.getItem(ADMIN_AUTH_PROFILE_KEY);
  if (!rawAdmin) {
    return { accessToken, admin: null };
  }

  try {
    return { accessToken, admin: JSON.parse(rawAdmin) as AdminProfile };
  } catch {
    localStorage.removeItem(ADMIN_AUTH_PROFILE_KEY);
    return { accessToken, admin: null };
  }
};

const persistAuthState = (nextAuthState: StoredAdminAuth) => {
  if (typeof window === "undefined") return;

  const { accessToken, admin } = nextAuthState;
  if (!accessToken) {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_AUTH_PROFILE_KEY);
    return;
  }

  localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, accessToken);
  if (admin) {
    localStorage.setItem(ADMIN_AUTH_PROFILE_KEY, JSON.stringify(admin));
  } else {
    localStorage.removeItem(ADMIN_AUTH_PROFILE_KEY);
  }
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<StoredAdminAuth>(() => getStoredAuthState());
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAdminAuthenticated: Boolean(authState.accessToken),
      accessToken: authState.accessToken,
      admin: authState.admin,
      isLoading,
      login: async (email: string, password: string) => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        if (!trimmedEmail || !trimmedPassword) {
          return { ok: false, message: "Email and password are required." };
        }

        setIsLoading(true);

        try {
          const response = await fetch(`${API_BASE_URL}${ADMIN_LOGIN_ENDPOINT}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: trimmedEmail,
              password: trimmedPassword,
            }),
          });

          let payload: AdminLoginApiResponse | null = null;

          try {
            payload = (await response.json()) as AdminLoginApiResponse;
          } catch {
            payload = null;
          }

          const accessToken = payload?.data?.accessToken;
          if (!response.ok || !payload?.status || !accessToken) {
            return {
              ok: false,
              message: payload?.message || "Admin login failed.",
            };
          }

          const nextAuthState: StoredAdminAuth = {
            accessToken,
            admin: payload?.data?.admin ?? null,
          };

          setAuthState(nextAuthState);
          persistAuthState(nextAuthState);

          return { ok: true };
        } catch {
          return {
            ok: false,
            message: "Unable to connect to server. Please try again.",
          };
        } finally {
          setIsLoading(false);
        }
      },
      logout: () => {
        const nextAuthState: StoredAdminAuth = { accessToken: null, admin: null };
        setAuthState(nextAuthState);
        persistAuthState(nextAuthState);
      },
    }),
    [authState, isLoading],
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
