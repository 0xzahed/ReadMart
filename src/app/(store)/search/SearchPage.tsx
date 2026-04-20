"use client";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";

export function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { products } = useStore();
  
  const queryParam = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(queryParam);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          {queryParam && (
            <p className="text-sm text-muted-foreground">
              for &quot;{queryParam}&quot;
            </p>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
