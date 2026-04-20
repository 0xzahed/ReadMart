"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Truck } from "lucide-react";

import { CampaignProductCard } from "@/components/store/CampaignProductCard";
import { buildAssetUrl, fetchFreeDeliveryPublic, type FreeDeliveryPublicProduct } from "@/lib/campaignApi";

export function FreeDeliverySection() {
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignTitle, setCampaignTitle] = useState("Free Delivery");
  const [products, setProducts] = useState<FreeDeliveryPublicProduct[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const payload = await fetchFreeDeliveryPublic({ page: 1, limit: 12 });
      setCampaignTitle(payload.campaign?.title || "Free Delivery");
      setProducts(Array.isArray(payload.products) ? payload.products : []);
    } catch {
      setCampaignTitle("Free Delivery");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const initialVisibleCount = 4;
  const visibleProducts = useMemo(() => {
    return showAll ? products : products.slice(0, initialVisibleCount);
  }, [products, showAll]);

  const canExpand = products.length > initialVisibleCount;

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-r from-primary/10 to-accent/10 p-4 md:p-6 lg:rounded-[28px] lg:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 p-3 md:p-4">
                <Truck className="h-6 w-6 text-primary md:h-8 md:w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground md:text-lg lg:text-xl">{campaignTitle}</h3>
                <p className="text-sm text-muted-foreground">Eligible products with free delivery</p>
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
          {isLoading ? (
            <div className="rounded-2xl border border-border/60 py-10 text-center text-sm text-muted-foreground">
              Loading free delivery products...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => {
                const imageUrl = buildAssetUrl(product.firstVariant?.imageUrl);
                const price = Number(product.firstVariant?.discountedPrice ?? 0);
                const previousPrice = Number(product.firstVariant?.actualPrice ?? 0);

                return (
                  <CampaignProductCard
                    key={product.id}
                    title={product.title}
                    imageUrl={imageUrl}
                    price={price}
                    previousPrice={previousPrice}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
