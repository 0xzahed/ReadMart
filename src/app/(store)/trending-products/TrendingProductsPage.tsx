"use client";

import { useNavigate } from "react-router-dom";

import { ProductCard } from "@/components/store/ProductCard";
import { StorePageHeader } from "@/components/ui/store";
import { useStore } from "@/contexts/StoreContext";

export function TrendingProductsPage() {
  const navigate = useNavigate();
  const { products } = useStore();

  const trendingProducts = [...products]
    .sort((a, b) => b.rating * (b.reviews ?? 0) - a.rating * (a.reviews ?? 0))
    .slice(0, 20);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <StorePageHeader title="Trending Products" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {trendingProducts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 py-20 text-center text-muted-foreground">
            No trending products found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}