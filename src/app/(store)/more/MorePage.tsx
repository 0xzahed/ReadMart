"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Shield,
  ChevronRight,
  MessageCircle,
  MessageSquareMore,
  PhoneCall,
  X,
} from "lucide-react";
import { StoreButton, StoreCard, StorePageHeader } from "@/components/ui/store";

export function MorePage() {
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Shield, label: "Privacy Policy", href: "/privacy" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="More" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="rounded-2xl border border-border/70 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Welcome to ReadMart</h2>
              <p className="text-sm text-muted-foreground">Find your favorite products in seconds.</p>
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
              onClick={() => setShowHelpModal(true)}
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
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/45 p-0 sm:items-center sm:justify-center sm:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-card p-5 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Help Center</h3>
              <button onClick={() => setShowHelpModal(false)} className="p-1 text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  navigate("/chat");
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Live Chat</p>
                  <p className="text-xs text-muted-foreground">Chat instantly with support</p>
                </div>
              </button>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
              >
                <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">WhatsApp Number</p>
                  <p className="text-xs text-muted-foreground">+880 1700-000000</p>
                </div>
              </a>
              <a
                href="https://m.me"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left"
              >
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
                  <MessageSquareMore className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Messenger</p>
                  <p className="text-xs text-muted-foreground">Message us on Facebook</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
