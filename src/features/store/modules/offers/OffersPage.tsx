"use client";

import { useNavigate } from "react-router-dom";
import { Tag, Percent, Gift, Truck, Zap } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { StoreButton, StoreCard, StorePageHeader } from "@/features/store/components/ui";

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
      <StorePageHeader title="Offers & Deals" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Promo Codes */}
        {promoCodes.length > 0 && (
          <StoreCard>
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
                    <StoreButton
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                      }}
                      tone="soft"
                      size="sm"
                    >
                      Copy
                    </StoreButton>
                  </div>
                ))}
            </div>
          </StoreCard>
        )}

        {/* Special Offers */}
        <div className="space-y-3">
          <h2 className="font-bold text-foreground mb-3">Special Offers</h2>
          <div className="space-y-3">
            {offers.map((offer) => {
              const Icon = offer.icon;
              return (
                <StoreCard key={offer.id} className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${offer.color} shrink-0 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                </StoreCard>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
