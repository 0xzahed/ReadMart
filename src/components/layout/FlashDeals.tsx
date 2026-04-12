"use client";

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { CountdownTimer } from "./CountdownTimer";
import { ProductCard } from "./ProductCard";

export function FlashDeals() {
  const { flashDeal, products } = useStore();

  if (!flashDeal || !flashDeal.isActive) return null;

  const flashDealProducts = products.filter((p) => p.isFlashDeal);

  if (flashDealProducts.length === 0) return null;

  return (
    <section className="py-6 md:py-8 lg:py-9">
      {/* Flash Deals Header */}
      <div className="mx-auto mb-4 w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl lg:rounded-[28px]"
          style={{
            backgroundImage: flashDeal.backgroundImage
              ? `url(${flashDeal.backgroundImage})`
              : "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 py-5 md:py-7 lg:py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white md:text-2xl">Flash Deals</h2>
              <Link
                to="/offers"
                className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white"
              >
                See All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <CountdownTimer endTime={flashDeal.endTime} />
          </div>
        </div>
      </div>

      {/* Flash Deal Products */}
      <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {flashDealProducts.slice(0, 10).map((product) => (
            <div key={product.id} className="w-42.5 shrink-0 sm:w-47.5 lg:w-57.5">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
