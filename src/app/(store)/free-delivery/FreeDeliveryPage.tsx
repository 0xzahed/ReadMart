"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Truck } from "lucide-react";

import { CampaignProductCard } from "@/components/store/CampaignProductCard";
import { StoreCard, StorePageHeader } from "@/components/ui/store";
import { buildAssetUrl, fetchFreeDeliveryPublic, type FreeDeliveryPublicProduct, type FreeDeliveryPublicResponse } from "@/lib/campaignApi";

const DEFAULT_PAGE_SIZE = 50;

export function FreeDeliveryPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [data, setData] = useState<FreeDeliveryPublicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchText]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = await fetchFreeDeliveryPublic({
        page: 1,
        limit: DEFAULT_PAGE_SIZE,
        search: debouncedSearch || undefined,
        categoryId: categoryId.trim() || undefined,
        subCategoryId: subCategoryId.trim() || undefined,
      });

      setData(payload);
    } catch (error) {
      setData(null);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load free delivery data.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, debouncedSearch, subCategoryId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const products = useMemo(() => {
    if (!data?.products) return [];
    return data.products;
  }, [data?.products]);

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Free Delivery" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 md:p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/20 p-3 md:p-4">
              <Truck className="h-6 w-6 text-primary md:h-8 md:w-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground md:text-xl">
                {data?.campaign?.title || "Free Delivery"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {data?.campaign?.isActive ? "Campaign is active" : "Campaign is inactive"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by title"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <input
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            placeholder="Filter by categoryId"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <input
            value={subCategoryId}
            onChange={(event) => setSubCategoryId(event.target.value)}
            placeholder="Filter by subCategoryId"
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">Loading products...</StoreCard>
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
            No products qualify for free delivery.
          </StoreCard>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">
                {data?.meta.total ?? products.length} Product
                {(data?.meta.total ?? products.length) !== 1 ? "s" : ""} Qualify
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product: FreeDeliveryPublicProduct) => {
                const imageUrl = buildAssetUrl(product.firstVariant?.imageUrl);
                const currentPrice = Number(product.firstVariant?.discountedPrice ?? 0);
                const previousPrice = Number(product.firstVariant?.actualPrice ?? 0);

                return (
                  <CampaignProductCard
                    key={product.id}
                    title={product.title}
                    imageUrl={imageUrl}
                    price={currentPrice}
                    previousPrice={previousPrice}
                    to={`/product/${product.id}`}
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
