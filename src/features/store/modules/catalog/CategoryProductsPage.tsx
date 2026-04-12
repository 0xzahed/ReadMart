"use client";

import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { ProductCard } from "@/components/layout/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { useStore } from "@/contexts/StoreContext";

export function CategoryProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, products } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<Record<string, string>>({});

  const category = categories.find((item) => item.id === id);
  const currentCategoryId = id || "";
  const selectedSubcategory = subcategoryFilter[currentCategoryId] || "all";
  const availableSubcategories = category?.subcategories || [];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.category !== id) return false;

      if (selectedSubcategory !== "all" && product.subcategory !== selectedSubcategory) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [id, products, searchQuery, selectedSubcategory]);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="mb-4 text-muted-foreground">Category not found</p>
        <Link to="/categories" className="font-semibold text-primary hover:text-primary/80">
          Go back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-330 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground md:text-xl">{category.name}</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search in ${category.name}`}
              className="h-11 w-full rounded-full border-0 bg-secondary pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {availableSubcategories.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide lg:flex-wrap lg:overflow-visible">
            <button
              onClick={() => setSubcategoryFilter((prev) => ({ ...prev, [currentCategoryId]: "all" }))}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedSubcategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-primary/10"
              }`}
            >
              All
            </button>
            {availableSubcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => setSubcategoryFilter((prev) => ({ ...prev, [currentCategoryId]: subcategory }))}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSubcategory === subcategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-primary/10"
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          {selectedSubcategory !== "all" && (
            <p className="text-sm text-muted-foreground">in {selectedSubcategory}</p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 py-20 text-center text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
