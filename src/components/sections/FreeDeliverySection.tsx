"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { useStore } from "@/contexts/StoreContext";

export function FreeDeliverySection() {
  const { products, freeDeliveryThreshold } = useStore();
  const [showAll, setShowAll] = useState(false);

  const freeDeliveryProducts = useMemo(
    () => products.filter((product) => product.price >= freeDeliveryThreshold),
    [freeDeliveryThreshold, products],
  );

  const initialVisibleCount = 4;
  const visibleProducts = showAll
    ? freeDeliveryProducts
    : freeDeliveryProducts.slice(0, initialVisibleCount);
  const canExpand = freeDeliveryProducts.length > initialVisibleCount;

  return (
    <section className="py-6 md:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-r from-primary/10 to-accent/10 p-4 md:p-6 lg:rounded-[28px] lg:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 p-3 md:p-4">
                <Truck className="h-6 w-6 text-primary md:h-8 md:w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground md:text-lg lg:text-xl">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">On orders over ${freeDeliveryThreshold}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canExpand ? (
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                  {showAll ? "View Less" : "View More"}
                  <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
                </button>
              ) : null}

              <Link
                to="/free-delivery"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {visibleProducts.length === 0 ? (
            <div className="rounded-2xl border border-border/60 py-10 text-center text-sm text-muted-foreground">
              No products available for free delivery.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
