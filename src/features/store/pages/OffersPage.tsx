"use client";

import { useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Percent, Gift, Truck, Zap } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export function OffersPage() {
  const navigate = useNavigate();
  const { promoCodes, freeDeliveryThreshold } = useStore();

  const offers = [
    {
      id: 1,
      icon: Truck,
      title: "Free Delivery",
      description: `On orders above $${freeDeliveryThreshold}`,
      color: "bg-blue-500",
    },
    {
      id: 2,
      icon: Percent,
      title: "Flash Sale",
      description: "Up to 50% off on selected items",
      color: "bg-red-500",
    },
    {
      id: 3,
      icon: Gift,
      title: "New User Bonus",
      description: "Extra 10% off on first order",
      color: "bg-purple-500",
    },
    {
      id: 4,
      icon: Zap,
      title: "Daily Deals",
      description: "New deals every day",
      color: "bg-orange-500",
    },
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
          <h1 className="text-lg font-bold">Offers & Deals</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Promo Codes */}
        {promoCodes.length > 0 && (
          <div className="bg-card rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Available Promo Codes
            </h2>
            <div className="space-y-2">
              {promoCodes
                .filter((p) => p.isActive)
                .map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between bg-secondary rounded-lg p-3"
                  >
                    <div>
                      <p className="font-mono font-bold text-primary">{promo.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {promo.discountPercent}% off
                        {promo.expiryDate && ` • Expires: ${promo.expiryDate}`}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                      }}
                      className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Special Offers */}
        <div>
          <h2 className="font-bold text-foreground mb-3">Special Offers</h2>
          <div className="space-y-3">
            {offers.map((offer) => {
              const Icon = offer.icon;
              return (
                <div
                  key={offer.id}
                  className="bg-card rounded-xl p-4 shadow-sm flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${offer.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
