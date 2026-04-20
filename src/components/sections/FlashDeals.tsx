"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { CountdownTimer } from "../store/CountdownTimer";
import { CampaignProductCard } from "../store/CampaignProductCard";
import { buildAssetUrl, fetchActiveFlashSaleProducts, type FlashSaleActiveProduct, type FlashSaleCampaignWithClock } from "@/lib/campaignApi";

export function FlashDeals() {
  const [campaign, setCampaign] = useState<FlashSaleCampaignWithClock | null>(null);
  const [products, setProducts] = useState<FlashSaleActiveProduct[]>([]);

  const loadData = useCallback(async () => {
    try {
      const payload = await fetchActiveFlashSaleProducts({ page: 1, limit: 10 });
      setCampaign(payload.campaign);
      setProducts(Array.isArray(payload.products) ? payload.products : []);
    } catch {
      setCampaign(null);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadData]);

  if (!campaign || products.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8 lg:py-9">
      <div className="mx-auto mb-4 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-orange-500 lg:rounded-[28px]">
          <div className="relative z-10 px-4 py-5 sm:px-6 md:py-7 lg:px-8 lg:py-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white md:text-2xl">{campaign.title}</h2>
              <Link
                to="/flash-deals"
                className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white"
              >
                See All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <CountdownTimer endTime={campaign.endAt} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((product) => {
            const firstVariant = product.variants[0];
            const imageUrl = buildAssetUrl(firstVariant?.imageUrl);
            const flashPrice = firstVariant?.flashSalePrice ?? firstVariant?.discountedPrice ?? 0;
            const previousPrice = firstVariant?.discountedPrice ?? undefined;

            return (
              <div key={product.id} className="w-42.5 shrink-0 sm:w-47.5 lg:w-57.5">
                <CampaignProductCard
                  title={product.title}
                  imageUrl={imageUrl}
                  price={flashPrice}
                  previousPrice={previousPrice}
                  compact
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
