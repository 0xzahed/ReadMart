"use client";

import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";
import { CountdownTimer } from "@/components/store/CountdownTimer";
import { StorePageHeader, StoreCard } from "@/components/ui/store";

export function FlashDealsPage() {
  const navigate = useNavigate();
  const { flashDeal, products } = useStore();

  const flashDealProducts = products.filter((p) => p.isFlashDeal);

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Flash Deals" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {/* Flash Deal Banner */}
        {flashDeal && flashDeal.isActive && (
          <div className="mb-6">
            <StoreCard
              className="relative overflow-hidden"
              style={{
                backgroundImage: flashDeal.backgroundImage
                  ? `url(${flashDeal.backgroundImage})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: !flashDeal.backgroundImage ? undefined : "transparent",
              }}
            >
              <div
                className={`relative z-10 ${flashDeal.backgroundImage ? "py-4 px-4" : "p-4 md:p-6"}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`rounded-full p-2 ${flashDeal.backgroundImage ? "bg-white/20" : "bg-red-100"}`}>
                    <Zap className={`h-5 w-5 ${flashDeal.backgroundImage ? "text-white" : "text-red-600"}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold md:text-xl ${flashDeal.backgroundImage ? "text-white" : "text-foreground"}`}>
                      Flash Deals
                    </h2>
                    <p className={`text-xs ${flashDeal.backgroundImage ? "text-white/80" : "text-muted-foreground"}`}>
                      Hurry! Deals end soon
                    </p>
                  </div>
                </div>
                <CountdownTimer endTime={flashDeal.endTime} />
              </div>
            </StoreCard>
          </div>
        )}

        {/* Products Grid */}
        {flashDealProducts.length === 0 ? (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">
            No flash deals available right now.
          </StoreCard>
        ) : (
          <div>
            <h3 className="text-base font-semibold text-foreground mb-3">
              {flashDealProducts.length} Deal{flashDealProducts.length !== 1 ? "s" : ""} Available
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {flashDealProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
