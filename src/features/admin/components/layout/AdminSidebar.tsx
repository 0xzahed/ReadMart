"use client";

import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  FileText,
  Image as ImageIcon,
  Tags,
  Zap,
  TicketPercent,
  Video,
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", tab: "dashboard" },
    { icon: ImageIcon, label: "Sliders", href: "/admin/dashboard", tab: "sliders" },
    { icon: ImageIcon, label: "Banner List", href: "/admin/dashboard", tab: "banner-list" },
    { icon: Tags, label: "Categories", href: "/admin/dashboard", tab: "categories" },
    { icon: Tags, label: "Tag Category", href: "/admin/dashboard", tab: "tag-category" },
    { icon: Package, label: "Products", href: "/admin/dashboard", tab: "products" },
    { icon: Package, label: "Entry Products", href: "/admin/dashboard", tab: "entry-products" },
    { icon: TicketPercent, label: "Entry Promotion", href: "/admin/dashboard", tab: "entry-promotion" },
    { icon: Zap, label: "Flash Deals", href: "/admin/dashboard", tab: "flash-deals" },
    { icon: Zap, label: "Flash Sale", href: "/admin/dashboard", tab: "flash-sale" },
    { icon: TicketPercent, label: "Promo Codes", href: "/admin/dashboard", tab: "promo" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/dashboard", tab: "orders" },
    { icon: ShoppingCart, label: "Trash Orders", href: "/admin/dashboard", tab: "trash-orders" },
    { icon: Users, label: "Customers", href: "/admin/dashboard", tab: "customers" },
    { icon: Users, label: "Customer List", href: "/admin/dashboard", tab: "customer-list" },
    { icon: Zap, label: "Free Delivery", href: "/admin/dashboard", tab: "free-delivery" },
    { icon: Tags, label: "Free Category Delivery", href: "/admin/dashboard", tab: "free-category-delivery" },
    { icon: Video, label: "YouTube Videos", href: "/admin/dashboard", tab: "video-list" },
    { icon: BarChart3, label: "Analytics", href: "/admin/dashboard", tab: "analytics" },
    { icon: FileText, label: "Reports", href: "/admin/dashboard", tab: "reports" },
    { icon: Settings, label: "Settings", href: "/admin/dashboard", tab: "settings" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-[#f8fafc] transition-transform duration-300 lg:sticky lg:z-20 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="border-b border-gray-200 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">ReadMart</p>
          <h1 className="mt-1 text-lg font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const href = item.tab ? `${item.href}?tab=${item.tab}` : item.href;
              const active = item.tab
                ? location.pathname.startsWith("/admin") && activeTab === item.tab
                : location.pathname === item.href || location.pathname.startsWith(item.href + "/");
              return (
                <li key={item.href + (item.tab || "")}>
                  <Link
                    to={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-blue-200 bg-[#eaf1ff] text-blue-700"
                        : "border-transparent text-gray-600 hover:border-gray-200 hover:bg-white"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/admin"
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-200 hover:bg-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
