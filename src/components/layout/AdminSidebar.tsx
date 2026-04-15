"use client";

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  Video,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubMenuItem {
  label: string;
  tab: string;
}

interface MenuGroup {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
  tab?: string;
  children?: SubMenuItem[];
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    sliders: true,
    categories: true,
    products: true,
    flashDeals: true,
    orders: true,
    customers: true,
    delivery: true,
  });

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActiveTab = (tab: string | undefined): boolean => {
    if (!tab) return false;
    return activeTab === tab;
  };

  const isGroupActive = (children: SubMenuItem[] | undefined): boolean => {
    if (!children) return false;
    return children.some((child) => isActiveTab(child.tab));
  };

  const menuGroups: MenuGroup[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", tab: "dashboard" },
    {
      icon: ImageIcon,
      label: "Sliders",
      href: "/admin/dashboard",
      children: [
        { label: "Banner Slides", tab: "sliders" },
        { label: "Banner List", tab: "banner-list" },
      ],
    },
    {
      icon: Tags,
      label: "Categories",
      href: "/admin/dashboard",
      children: [
        { label: "Categories List", tab: "categories" },
        { label: "Tag Category", tab: "tag-category" },
      ],
    },
    {
      icon: Package,
      label: "Products",
      href: "/admin/dashboard",
      children: [
        { label: "Product List", tab: "products" },
        { label: "Entry Products", tab: "entry-products" },
        { label: "Entry Promotion", tab: "entry-promotion" },
      ],
    },
    {
      icon: Zap,
      label: "Flash Deals",
      href: "/admin/dashboard",
      children: [
        { label: "Flash Deals", tab: "flash-deals" },
        { label: "Flash Sale", tab: "flash-sale" },
        { label: "Promo Codes", tab: "promo" },
      ],
    },
    {
      icon: ShoppingCart,
      label: "Orders",
      href: "/admin/dashboard",
      children: [
        { label: "Orders", tab: "orders" },
        { label: "Trash Orders", tab: "trash-orders" },
      ],
    },
    {
      icon: Users,
      label: "Customers",
      href: "/admin/dashboard",
      children: [
        { label: "Customers", tab: "customers" },
        { label: "Customer List", tab: "customer-list" },
      ],
    },
    {
      icon: Tags,
      label: "Delivery",
      href: "/admin/dashboard",
      children: [
        { label: "Free Delivery", tab: "free-delivery" },
        { label: "Free Category Delivery", tab: "free-category-delivery" },
      ],
    },
    { icon: Video, label: "YouTube Videos", href: "/admin/dashboard", tab: "video-list" },
    { icon: BarChart3, label: "Analytics", href: "/admin/dashboard", tab: "analytics" },
    { icon: FileText, label: "Reports", href: "/admin/dashboard", tab: "reports" },
    { icon: Settings, label: "Settings", href: "/admin/dashboard", tab: "settings" },
  ];

  const renderMenuItem = (item: MenuGroup) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const groupKey = item.label.toLowerCase().replace(/\s+/g, "");

    if (!hasChildren) {
      // Single menu item without submenu
      const href = item.tab ? `${item.href}?tab=${item.tab}` : item.href;
      const active = isActiveTab(item.tab);

      return (
        <li key={groupKey}>
          <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.18 }}>
            <Link
            to={href}
            onClick={onClose}
            className={`relative flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors ${
              active
                ? "border-primary/35 bg-primary/12 text-primary shadow-sm"
                : "border-slate-200/80 bg-white/75 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
            }`}
          >
            {active && (
              <motion.span
                layoutId="admin-active-pill"
                className="absolute inset-0 rounded-xl border border-primary/40"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
            </Link>
          </motion.div>
        </li>
      );
    }

    // Menu group with submenu
    const isOpen = openMenus[groupKey] || false;
    const isActive = isGroupActive(item.children);

    return (
      <li key={groupKey}>
        <motion.button
          onClick={() => toggleMenu(groupKey)}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.18 }}
          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-colors ${
            isActive
              ? "border-primary/35 bg-primary/12 text-primary shadow-sm"
              : "border-slate-200/80 bg-white/75 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </div>
          <motion.span animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
          </motion.span>
        </motion.button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="ml-8 mt-2 space-y-1.5 overflow-hidden border-l-2 border-slate-200/90 pl-3.5"
            >
              {item.children!.map((child) => {
                const childActive = isActiveTab(child.tab);
                return (
                  <li key={child.tab}>
                    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.16 }}>
                      <Link
                        to={`${item.href}?tab=${child.tab}`}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          childActive
                            ? "border-primary/35 bg-primary/12 text-primary"
                            : "border-slate-200/70 bg-white/75 text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700"
                        }`}
                      >
                        <span>{child.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

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
      <motion.aside
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200/80 bg-linear-to-b from-white via-slate-50 to-slate-100/70 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out lg:sticky lg:z-20 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="border-b border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ReadMart</p>
          <h1 className="mt-1.5 text-lg font-bold text-slate-900">Admin Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <ul className="space-y-2.5">
            {menuGroups.map((item) => renderMenuItem(item))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200/80 bg-white/70 p-4">
          <Link
            to="/admin"
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-200/80 hover:bg-white/85 hover:text-slate-900"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
