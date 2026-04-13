import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAdminAuth } from "@/contexts/AdminAuthContext";

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdminAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
