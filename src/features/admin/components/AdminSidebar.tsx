"use client";

import { Link, useLocation } from "react-router-dom";
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
  LogOut,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: ImageIcon, label: "Sliders", href: "/admin", tab: "sliders" },
    { icon: Tags, label: "Categories", href: "/admin", tab: "categories" },
    { icon: Package, label: "Products", href: "/admin", tab: "products" },
    { icon: Zap, label: "Flash Deals", href: "/admin", tab: "flash-deals" },
    { icon: TicketPercent, label: "Promo Codes", href: "/admin", tab: "promo" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
    { icon: Settings, label: "Settings", href: "/admin", tab: "settings" },
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
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto lg:w-64 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ReadMart</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const href = item.tab ? `/admin?tab=${item.tab}` : item.href;
              const active = location.pathname === item.href || (item.tab && location.pathname.includes(`tab=${item.tab}`));
              return (
                <li key={item.href + (item.tab || "")}>
                  <Link
                    to={href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
