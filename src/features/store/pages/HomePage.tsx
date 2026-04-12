"use client";

import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroSlider } from "@/components/layout/HeroSlider";
import { CategoriesGrid } from "@/components/layout/CategoriesGrid";
import { FlashDeals } from "@/components/layout/FlashDeals";
import { FreeDeliverySection } from "@/components/layout/FreeDeliverySection";
import { ProductCard } from "@/components/layout/ProductCard";
import { useStore } from "@/contexts/StoreContext";

export function HomePage() {
  const navigate = useNavigate();
  const { products } = useStore();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Get featured products (flash deals or first 8 products)
  const featuredProducts = products.filter((p) => p.isFlashDeal).slice(0, 8);
  const allProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 12);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {/* Mobile Header */}
      <MobileHeader onSearch={handleSearch} />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories */}
      <CategoriesGrid />

      {/* Flash Deals */}
      <FlashDeals />

      {/* Free Delivery Section */}
      <FreeDeliverySection />

      {/* Featured Products */}
      <section className="py-6 md:py-8 lg:py-10">
        <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-lg font-bold text-foreground md:text-2xl">Featured Products</h2>
            <p className="hidden text-sm text-muted-foreground lg:block">
              Handpicked products with top ratings and better prices
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
