import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Users,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAdminAuth } from "@/contexts/AdminAuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/reports", label: "Reports", icon: FileText },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const onSignOut = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/[0.06] via-background to-background transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex min-h-16 w-full flex-wrap items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Store className="h-5 w-5 text-primary" />
            <span className="sm:hidden">Admin</span>
            <span className="hidden sm:inline">ReadMart Admin</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary sm:inline-flex"
            >
              View Storefront
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-2.5 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/85 sm:px-3"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1700px] gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[248px_1fr] lg:gap-5 lg:px-5">
        <aside className="h-fit rounded-2xl border border-border/70 bg-card/90 p-2.5 shadow-sm backdrop-blur-sm lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
          <nav className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_hsl(var(--primary))]"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 rounded-2xl border border-border/60 bg-background/70 p-2 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out sm:p-3 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
