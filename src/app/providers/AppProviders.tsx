import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";

const queryClient = new QueryClient();

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <StoreProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              {children}
            </CartProvider>
          </StoreProvider>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}