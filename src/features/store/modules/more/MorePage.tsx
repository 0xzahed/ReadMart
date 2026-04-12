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
} from "lucide-react";
import { StoreButton, StoreCard, StorePageHeader } from "@/features/store/components/ui";

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
      <StorePageHeader title="More" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Quick Actions Card */}
        <div className="bg-linear-to-r from-primary/10 to-accent/10 rounded-xl p-6">
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

        {/* Menu Items */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <StoreCard padding="none" className="overflow-hidden">
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
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              );
            })}
          </StoreCard>

          {/* Customer Support Card */}
          <StoreCard>
            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contact our support team for any assistance
            </p>
            <StoreButton
              onClick={() => navigate("/chat")}
              fullWidth
              size="lg"
            >
              Chat with Support
            </StoreButton>
          </StoreCard>
        </div>

        {/* App Version */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          ReadMart v1.0.0
        </p>
      </div>
    </div>
  );
}
