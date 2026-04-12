"use client";

import { Link } from "react-router-dom";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

interface CategoriesGridProps {
  maxVisible?: number;
}

export function CategoriesGrid({ maxVisible = 6 }: CategoriesGridProps) {
  const { categories } = useStore();

  const activeCategories = categories.filter((c) => c.isActive);
  const visibleCategories = activeCategories.slice(0, maxVisible);
  const hasMore = activeCategories.length > maxVisible;

  return (
    <section className="py-6 md:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground md:text-2xl">Categories</h2>
          <Link to="/explore" className="text-sm font-medium text-primary hover:text-primary/80">
            Browse all
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-6 xl:grid-cols-7">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link || `/category/${category.id}`}
              className="group flex flex-col items-center"
            >
              <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md lg:rounded-2xl">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover p-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
              <span className="w-full truncate text-center text-xs font-medium text-foreground md:text-sm">
                {category.name}
              </span>
            </Link>
          ))}

          {/* More Button */}
          {hasMore && (
            <Link
              to="/categories"
              className="group flex flex-col items-center"
            >
              <div className="relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-secondary transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md lg:rounded-2xl">
                <div className="flex flex-col items-center gap-1">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">More</span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
