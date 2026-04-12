"use client";

import { useNavigate } from "react-router-dom";
import {
  Package,
  Heart,
  Bell,
  HelpCircle,
  Shield,
  Share2,
  Truck,
  Tag,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export function MorePage() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Truck, label: "Track Order", href: "/track-order" },
    { icon: Tag, label: "Offers & Deals", href: "/offers" },
    { icon: HelpCircle, label: "Help Center", href: "/help" },
    { icon: Shield, label: "Privacy Policy", href: "/privacy" },
    { icon: Share2, label: "Share App", href: "/share" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">More</h1>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Welcome to ReadMart</h2>
              <p className="text-sm text-muted-foreground">Shop amazing deals today!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-20">
        <div className="bg-card rounded-xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-secondary/50 transition-colors text-left ${
                  index !== menuItems.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="flex-1 font-medium text-foreground">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        {/* Customer Support Card */}
        <div className="mt-4 bg-card rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contact our support team for any assistance
          </p>
          <button
            onClick={() => navigate("/chat")}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Chat with Support
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          ReadMart v1.0.0
        </p>
      </div>
    </div>
  );
}
