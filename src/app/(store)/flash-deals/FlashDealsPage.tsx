"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Zap } from "lucide-react";

import { CountdownTimer } from "@/components/store/CountdownTimer";
import { CampaignProductCard } from "@/components/store/CampaignProductCard";
import { StoreCard, StorePageHeader } from "@/components/ui/store";
import { buildAssetUrl, fetchActiveFlashSaleProducts, type FlashSaleActiveProduct, type FlashSaleCampaignWithClock } from "@/lib/campaignApi";

export function FlashDealsPage() {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<FlashSaleCampaignWithClock | null>(null);
  const [products, setProducts] = useState<FlashSaleActiveProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = await fetchActiveFlashSaleProducts({ page: 1, limit: 100 });
      setCampaign(payload.campaign);
      setProducts(Array.isArray(payload.products) ? payload.products : []);
    } catch (error) {
      setCampaign(null);
      setProducts([]);
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch flash deals.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const campaignTitle = useMemo(() => {
    if (!campaign?.title) return "Flash Deals";
    return campaign.title;
  }, [campaign?.title]);

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Flash Deals" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {campaign ? (
          <div className="mb-6">
            <StoreCard className="relative overflow-hidden bg-linear-to-r from-rose-500 via-pink-500 to-orange-500 p-4 text-white md:p-6">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold md:text-xl">{campaignTitle}</h2>
                  <p className="text-xs text-white/90">Hurry! Deals end soon</p>
                </div>
              </div>
              <CountdownTimer endTime={campaign.endAt} />
            </StoreCard>
          </div>
        ) : null}

        {isLoading ? (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">Loading flash deals...</StoreCard>
        ) : errorMessage ? (
          <StoreCard className="space-y-3 py-10 text-center">
            <p className="text-sm text-destructive">{errorMessage}</p>
            <button
              type="button"
              onClick={() => void loadData()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Retry
            </button>
          </StoreCard>
        ) : products.length === 0 ? (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">
            No active flash sale products are available right now.
          </StoreCard>
        ) : (
          <div>
            <h3 className="mb-3 text-base font-semibold text-foreground">
              {products.length} Deal{products.length !== 1 ? "s" : ""} Available
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => {
                const firstVariant = product.variants[0];
                const imageUrl = buildAssetUrl(firstVariant?.imageUrl);
                const flashPrice = firstVariant?.flashSalePrice ?? firstVariant?.discountedPrice ?? 0;
                const discountedPrice = firstVariant?.discountedPrice ?? undefined;

                return (
                  <CampaignProductCard
                    key={product.id}
                    title={product.title}
                    imageUrl={imageUrl}
                    price={flashPrice}
                    previousPrice={discountedPrice}
                    badge={firstVariant ? undefined : "No Variant"}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
