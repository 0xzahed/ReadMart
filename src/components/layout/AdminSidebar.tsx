"use client";

import { useEffect, useState } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  Truck,
  BarChart3,
  Zap,
  Image as ImageIcon,
  Megaphone,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

type SubItem = { label: string; path: string };
type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: SubItem[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  {
    label: "Sliders",
    icon: ImageIcon,
    children: [
      { label: "Slider List", path: "/admin/banners" },
      { label: "Add Slider", path: "/admin/banners/new" },
    ],
  },
  {
    label: "Categories",
    icon: Tag,
    children: [
      { label: "Categories List", path: "/admin/categories" },
      { label: "Tag Category", path: "/admin/categories/tags" },
    ],
  },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "Product List", path: "/admin/products" },
      { label: "Entry Products", path: "/admin/products/new" },
      { label: "Entry Promotion", path: "/admin/products/promotion" },
    ],
  },
  {
    label: "Flash Deals",
    icon: Zap,
    children: [
      { label: "Flash Deals", path: "/admin/flash-deals" },
      { label: "Flash Sale", path: "/admin/flash-sale" },
      { label: "Promo Codes", path: "/admin/coupons" },
    ],
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    children: [
      { label: "Orders", path: "/admin/orders" },
      { label: "Trash Orders", path: "/admin/orders/trash" },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    children: [
      { label: "Manage Admins", path: "/admin/manage-admins" },
      { label: "All Customers", path: "/admin/customers" },
      { label: "Reviews", path: "/admin/customers/reviews" },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    children: [
      { label: "Notifications", path: "/admin/notifications" },
      { label: "Chat", path: "/admin/chat" },
      { label: "Campaigns", path: "/admin/campaigns" },
    ],
  },
  {
    label: "Shipping",
    icon: Truck,
    children: [
      { label: "Shipping Zones", path: "/admin/shipping" },
      { label: "Payments", path: "/admin/payments" },
    ],
  },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Analytics", path: "/admin/analytics" },
      { label: "Sales Report", path: "/admin/reports/sales" },
    ],
  },
  {
    label: "System",
    icon: Settings,
    children: [
      { label: "Settings", path: "/admin/settings" },
      { label: "Roles & Permissions", path: "/admin/roles" },
    ],
  },
];

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  return (
    <>
      <SidebarMobileStateSync isOpen={isOpen} onClose={onClose} />
      <AdminSidebarContent onClose={onClose} />
    </>
  );
}

function SidebarMobileStateSync({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (!isMobile) return;
    if (openMobile !== isOpen) {
      setOpenMobile(isOpen);
    }
  }, [isMobile, openMobile, setOpenMobile, isOpen]);

  useEffect(() => {
    if (!isMobile || openMobile) return;
    onClose?.();
  }, [isMobile, openMobile, onClose]);

  return null;
}

function AdminSidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const collapsed = false;

  const closeMobileSidebar = () => {
    onClose?.();
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => isActive(child.path)) ?? false;

  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        {!collapsed ? (
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              ShopHub
            </span>
            <h1 className="mt-0.5 text-lg font-bold text-foreground">
              Admin Dashboard
            </h1>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-base font-bold text-primary">S</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-3 py-3">
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            if (!item.children) {
              return (
                <TopLink
                  key={item.label}
                  item={item}
                  active={item.path ? isActive(item.path) : false}
                  collapsed={collapsed}
                  onNavigate={closeMobileSidebar}
                />
              );
            }

            return (
              <CollapsibleItem
                key={item.label}
                item={item}
                defaultOpen={isGroupActive(item)}
                isActive={isActive}
                collapsed={collapsed}
                onNavigate={closeMobileSidebar}
              />
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-3">
        <RouterNavLink
          to="/"
          onClick={closeMobileSidebar}
          className={cn(
            "flex items-center gap-3 rounded-full border border-sidebar-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary",
            collapsed && "justify-center px-0"
          )}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </RouterNavLink>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <RouterNavLink
      to={item.path!}
      end
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
        active
          ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
          : "border-sidebar-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
    </RouterNavLink>
  );
}

function CollapsibleItem({
  item,
  defaultOpen,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  defaultOpen: boolean;
  isActive: (path: string) => boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
    }
  }, [defaultOpen]);

  const groupActive = item.children?.some((child) => isActive(child.path)) ?? false;

  if (collapsed) {
    return (
      <RouterNavLink
        to={item.children![0].path}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-center rounded-full border px-0 py-2.5 text-sm transition-colors",
          groupActive
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-sidebar-border bg-background text-foreground hover:bg-primary/5 hover:text-primary"
        )}
        title={item.label}
      >
        <item.icon className="h-4 w-4" />
      </RouterNavLink>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex w-full items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium transition-all",
            groupActive
              ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
              : "border-sidebar-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="mt-1.5 flex flex-col gap-1 pl-4">
          {item.children!.map((child) => {
            const active = isActive(child.path);
            return (
              <RouterNavLink
                key={child.path}
                to={child.path}
                onClick={onNavigate}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-sidebar-border bg-background text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                {child.label}
              </RouterNavLink>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
