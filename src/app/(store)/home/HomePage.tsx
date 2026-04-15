"use client";

import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { CategoriesGrid } from "@/components/sections/CategoriesGrid";
import { FlashDeals } from "@/components/sections/FlashDeals";
import { FreeDeliverySection } from "@/components/sections/FreeDeliverySection";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/contexts/StoreContext";
import { Link } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  const { categories, products } = useStore();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const trendingProducts = [...products]
    .sort((a, b) => b.rating * (b.reviews ?? 0) - a.rating * (a.reviews ?? 0))
    .slice(0, 10);

  const newProducts = [...products].slice(-10).reverse();

  const categoryProductGroups = categories
    .filter((category) => category.isActive)
    .map((category) => ({
      category,
      products: products.filter((product) => product.category === category.id).slice(0, 10),
    }))
    .filter((group) => group.products.length > 0);

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

      {trendingProducts.length > 0 ? (
        <section className="py-6 md:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg font-bold text-foreground md:text-2xl">Trending Products</h2>
              <Link to="/trending-products" className="text-sm font-medium text-primary hover:text-primary/80">
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {newProducts.length > 0 ? (
        <section className="py-6 md:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg font-bold text-foreground md:text-2xl">New Products</h2>
              <Link to="/new-products" className="text-sm font-medium text-primary hover:text-primary/80">
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {categoryProductGroups.map(({ category, products: categoryProducts }) => (
        <section key={category.id} className="py-6 md:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between">
              <h2 className="text-lg font-bold text-foreground md:text-2xl">{category.name} Products</h2>
              <Link
                to={`/categories/${category.id}`}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
