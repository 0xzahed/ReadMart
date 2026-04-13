"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";
import { StorePageHeader, StoreCard } from "@/components/ui/store";

export function FreeDeliveryPage() {
  const navigate = useNavigate();
  const { products, freeDeliveryThreshold } = useStore();
  const [showAll, setShowAll] = useState(false);

  const freeDeliveryProducts = useMemo(
    () => products.filter((product) => product.price >= freeDeliveryThreshold),
    [freeDeliveryThreshold, products],
  );

  const initialVisibleCount = 8;
  const visibleProducts = showAll
    ? freeDeliveryProducts
    : freeDeliveryProducts.slice(0, initialVisibleCount);
  const canExpand = freeDeliveryProducts.length > initialVisibleCount;

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Free Delivery" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {/* Free Delivery Banner */}
        <div className="mb-6">
          <StoreCard className="rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 md:p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/20 p-3 md:p-4">
                <Truck className="h-6 w-6 text-primary md:h-8 md:w-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground md:text-xl">Free Delivery</h2>
                <p className="text-sm text-muted-foreground">
                  On orders over <span className="font-semibold text-primary">${freeDeliveryThreshold}</span>
                </p>
              </div>
            </div>
          </StoreCard>
        </div>

        {/* Products Grid */}
        {freeDeliveryProducts.length === 0 ? (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">
            No products qualify for free delivery.
          </StoreCard>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">
                {freeDeliveryProducts.length} Product{freeDeliveryProducts.length !== 1 ? "s" : ""} Qualify
              </h3>
              {canExpand && (
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  {showAll ? "View Less" : "View More"}
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
