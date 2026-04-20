"use client";

import Image from "next/image";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, products } = useStore();

  const activeCategories = categories.filter((category) => category.isActive);

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground md:text-xl">All Categories</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
          {activeCategories.map((category) => {
            const categoryCount = products.filter((product) => product.category === category.id).length;

            return (
              <Link
                key={category.id}
                to={category.link || `/categories/${category.id}`}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-secondary">
                  <Image src={category.image} alt={category.name} fill className="object-cover" />
                </div>
                <div className="p-2.5 sm:p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{category.name}</h3>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{categoryCount} products</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  {(category.subcategories || []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(category.subcategories || []).slice(0, 2).map((subcategory) => (
                        <span
                          key={subcategory}
                          className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                        >
                          {subcategory}
                        </span>
                      ))}
                      {(category.subcategories || []).length > 2 && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          +{(category.subcategories || []).length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
