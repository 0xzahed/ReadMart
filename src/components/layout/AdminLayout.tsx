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
    <div className="min-h-screen bg-secondary/35 transition-colors duration-300">
      <header className="border-b border-border bg-background/95 backdrop-blur transition-all duration-300">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <Store className="h-5 w-5 text-primary" />
            ReadMart Admin
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              View Storefront
            </Link>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/85"
              onClick={onSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1700px] gap-4 px-3 py-5 sm:px-4 lg:grid-cols-[228px_1fr] lg:px-5">
        <aside className="h-fit rounded-xl border border-border/80 bg-background/90 p-2.5 shadow-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
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

        <main className="transition-all duration-300 ease-out">
          <Outlet />
        </main>
      </div>
    </div>
  );
}