"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/admin/SectionHeading";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  buildAssetUrl,
  fetchFreeDeliveryAdmin,
  fetchFreeDeliveryPublic,
  getCampaignApiBaseUrl,
  type FreeDeliveryAdminResponse,
  type FreeDeliveryPublicResponse,
  updateFreeDeliveryCampaign,
  updateFreeDeliveryCategories,
  updateFreeDeliveryProducts,
  updateFreeDeliverySubCategories,
} from "@/lib/campaignApi";

const parseIds = (value: string): string[] => {
  return Array.from(new Set(value.split(/[\s,]+/g).map((item) => item.trim()).filter(Boolean)));
};

const INITIAL_PAGE = 1;
const INITIAL_LIMIT = 10;

export function AdminFreeDeliveryPage() {
  const { accessToken } = useAdminAuth();

  const [adminData, setAdminData] = useState<FreeDeliveryAdminResponse | null>(null);
  const [publicData, setPublicData] = useState<FreeDeliveryPublicResponse | null>(null);

  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [page, setPage] = useState(INITIAL_PAGE);

  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignIsActive, setCampaignIsActive] = useState(true);

  const [addCategoryIds, setAddCategoryIds] = useState("");
  const [removeCategoryIds, setRemoveCategoryIds] = useState("");
  const [addSubCategoryIds, setAddSubCategoryIds] = useState("");
  const [removeSubCategoryIds, setRemoveSubCategoryIds] = useState("");
  const [addProductIds, setAddProductIds] = useState("");
  const [removeProductIds, setRemoveProductIds] = useState("");

  const isApiReady = useMemo(() => getCampaignApiBaseUrl().length > 0, []);

  const loadAdminData = useCallback(async () => {
    if (!isApiReady || !accessToken) return;

    setIsLoadingAdmin(true);

    try {
      const payload = await fetchFreeDeliveryAdmin(accessToken);
      setAdminData(payload);
      setCampaignTitle(payload.title);
      setCampaignIsActive(payload.isActive);
    } catch (error) {
      setAdminData(null);
      toast.error(error instanceof Error ? error.message : "Failed to load free delivery admin data.");
    } finally {
      setIsLoadingAdmin(false);
    }
  }, [accessToken, isApiReady]);

  const loadPublicData = useCallback(async () => {
    if (!isApiReady) return;

    setIsLoadingPublic(true);

    try {
      const payload = await fetchFreeDeliveryPublic({
        page,
        limit: INITIAL_LIMIT,
        search: searchText.trim() || undefined,
        categoryId: categoryId.trim() || undefined,
        subCategoryId: subCategoryId.trim() || undefined,
      });

      setPublicData(payload);
    } catch (error) {
      setPublicData(null);
      toast.error(error instanceof Error ? error.message : "Failed to load free delivery public data.");
    } finally {
      setIsLoadingPublic(false);
    }
  }, [categoryId, isApiReady, page, searchText, subCategoryId]);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  useEffect(() => {
    void loadPublicData();
  }, [loadPublicData]);

  const handleCampaignUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateFreeDeliveryCampaign(
        {
          title: campaignTitle.trim(),
          isActive: campaignIsActive,
        },
        accessToken,
      );

      toast.success("Free delivery campaign updated.");
      await Promise.all([loadAdminData(), loadPublicData()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const runSourceUpdate = async (
    runner: () => Promise<unknown>,
    onSuccess: string,
    reset: () => void,
  ) => {
    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await runner();
      toast.success(onSuccess);
      reset();
      await Promise.all([loadAdminData(), loadPublicData()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update free delivery sources.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryUpdate = async () => {
    const addIds = parseIds(addCategoryIds);
    const removeIds = parseIds(removeCategoryIds);

    if (addIds.length === 0 && removeIds.length === 0) {
      toast.error("Add or remove at least one category ID.");
      return;
    }

    await runSourceUpdate(
      () =>
        updateFreeDeliveryCategories(
          {
            addCategoryIds: addIds.length > 0 ? addIds : undefined,
            removeCategoryIds: removeIds.length > 0 ? removeIds : undefined,
          },
          accessToken || "",
        ),
      "Free delivery categories updated.",
      () => {
        setAddCategoryIds("");
        setRemoveCategoryIds("");
      },
    );
  };

  const handleSubCategoryUpdate = async () => {
    const addIds = parseIds(addSubCategoryIds);
    const removeIds = parseIds(removeSubCategoryIds);

    if (addIds.length === 0 && removeIds.length === 0) {
      toast.error("Add or remove at least one subcategory ID.");
      return;
    }

    await runSourceUpdate(
      () =>
        updateFreeDeliverySubCategories(
          {
            addSubCategoryIds: addIds.length > 0 ? addIds : undefined,
            removeSubCategoryIds: removeIds.length > 0 ? removeIds : undefined,
          },
          accessToken || "",
        ),
      "Free delivery subcategories updated.",
      () => {
        setAddSubCategoryIds("");
        setRemoveSubCategoryIds("");
      },
    );
  };

  const handleProductUpdate = async () => {
    const addIds = parseIds(addProductIds);
    const removeIds = parseIds(removeProductIds);

    if (addIds.length === 0 && removeIds.length === 0) {
      toast.error("Add or remove at least one product ID.");
      return;
    }

    await runSourceUpdate(
      () =>
        updateFreeDeliveryProducts(
          {
            addProductIds: addIds.length > 0 ? addIds : undefined,
            removeProductIds: removeIds.length > 0 ? removeIds : undefined,
          },
          accessToken || "",
        ),
      "Free delivery products updated.",
      () => {
        setAddProductIds("");
        setRemoveProductIds("");
      },
    );
  };

  if (!isApiReady) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        NEXT_PUBLIC_API_BASE_URL is missing in frontend env.
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Admin token missing. Please login again.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Free Delivery"
        subtitle="Manage free-delivery campaign settings and preview public results."
        action={(
          <button
            type="button"
            onClick={() => {
              void loadAdminData();
              void loadPublicData();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        )}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <form onSubmit={handleCampaignUpdate} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Campaign Settings</h3>
          <input
            value={campaignTitle}
            onChange={(event) => setCampaignTitle(event.target.value)}
            placeholder="Campaign title"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            required
          />
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={campaignIsActive}
              onChange={(event) => setCampaignIsActive(event.target.checked)}
              className="h-4 w-4"
            />
            Campaign is active
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Campaign
          </button>

          {isLoadingAdmin ? (
            <p className="text-sm text-muted-foreground">Loading campaign summary...</p>
          ) : adminData ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <p><span className="font-medium">Free products:</span> {adminData.freeProductCount}</p>
              <p>
                <span className="font-medium">Sources:</span> Categories {adminData.sourceCounts.categories}, Subcategories {adminData.sourceCounts.subCategories}, Products {adminData.sourceCounts.products}, Excluded {adminData.sourceCounts.excludedProducts}
              </p>
            </div>
          ) : null}
        </form>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Public Preview Filters</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
                setPage(INITIAL_PAGE);
              }}
              placeholder="Search title"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            />
            <input
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setPage(INITIAL_PAGE);
              }}
              placeholder="categoryId"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            />
            <input
              value={subCategoryId}
              onChange={(event) => {
                setSubCategoryId(event.target.value);
                setPage(INITIAL_PAGE);
              }}
              placeholder="subCategoryId"
              className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            />
            <button
              type="button"
              onClick={() => void loadPublicData()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoadingPublic}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoadingPublic ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          {publicData ? (
            <p className="text-sm text-gray-700">Showing {publicData.meta.total} products from public API.</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Categories Source</h3>
          <textarea
            rows={3}
            value={addCategoryIds}
            onChange={(event) => setAddCategoryIds(event.target.value)}
            placeholder="Add category IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <textarea
            rows={3}
            value={removeCategoryIds}
            onChange={(event) => setRemoveCategoryIds(event.target.value)}
            placeholder="Remove category IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => void handleCategoryUpdate()}
            disabled={isSubmitting}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-70"
          >
            Save Categories
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Subcategories Source</h3>
          <textarea
            rows={3}
            value={addSubCategoryIds}
            onChange={(event) => setAddSubCategoryIds(event.target.value)}
            placeholder="Add subcategory IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <textarea
            rows={3}
            value={removeSubCategoryIds}
            onChange={(event) => setRemoveSubCategoryIds(event.target.value)}
            placeholder="Remove subcategory IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => void handleSubCategoryUpdate()}
            disabled={isSubmitting}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-70"
          >
            Save Subcategories
          </button>
        </div>

        <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Products Source</h3>
          <textarea
            rows={3}
            value={addProductIds}
            onChange={(event) => setAddProductIds(event.target.value)}
            placeholder="Add product IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <textarea
            rows={3}
            value={removeProductIds}
            onChange={(event) => setRemoveProductIds(event.target.value)}
            placeholder="Remove product IDs"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
          />
          <button
            type="button"
            onClick={() => void handleProductUpdate()}
            disabled={isSubmitting}
            className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-70"
          >
            Save Products
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Configured Sources</h3>
          {isLoadingAdmin ? (
            <p className="text-sm text-muted-foreground">Loading sources...</p>
          ) : !adminData ? (
            <p className="text-sm text-muted-foreground">No campaign data found.</p>
          ) : (
            <div className="grid gap-3 text-xs text-gray-700 md:grid-cols-2">
              <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                <p className="mb-1 font-semibold text-gray-900">Categories ({adminData.sources.categories.length})</p>
                {adminData.sources.categories.map((item) => (
                  <p key={item.id}>{item.category.title} ({item.categoryId})</p>
                ))}
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                <p className="mb-1 font-semibold text-gray-900">Subcategories ({adminData.sources.subCategories.length})</p>
                {adminData.sources.subCategories.map((item) => (
                  <p key={item.id}>{item.subCategory.title} ({item.subCategoryId})</p>
                ))}
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                <p className="mb-1 font-semibold text-gray-900">Products ({adminData.sources.products.length})</p>
                {adminData.sources.products.map((item) => (
                  <p key={item.id}>{item.product.title} ({item.productId})</p>
                ))}
              </div>
              <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
                <p className="mb-1 font-semibold text-gray-900">Excluded ({adminData.sources.excludedProducts.length})</p>
                {adminData.sources.excludedProducts.map((item) => (
                  <p key={item.id}>{item.product.title} ({item.productId})</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Public Products</h3>
          {isLoadingPublic ? (
            <p className="text-sm text-muted-foreground">Loading public products...</p>
          ) : !publicData || publicData.products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No public free-delivery products found.</p>
          ) : (
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full min-w-140 text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Category</th>
                      <th className="pb-3 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicData.products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 text-gray-900">
                          <div className="flex items-center gap-2">
                            {product.firstVariant?.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={buildAssetUrl(product.firstVariant.imageUrl)}
                                alt={product.title}
                                className="h-8 w-8 rounded object-cover"
                              />
                            ) : null}
                            <span>{product.title}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-700">{product.category.title}</td>
                        <td className="py-3 text-gray-700">{product.firstVariant?.discountedPrice ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">
                  Page {publicData.meta.page} of {Math.max(publicData.meta.totalPage, 1)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page <= 1 || isLoadingPublic}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPage((prev) =>
                        publicData.meta.totalPage === 0
                          ? prev
                          : Math.min(prev + 1, publicData.meta.totalPage),
                      )
                    }
                    disabled={
                      isLoadingPublic ||
                      publicData.meta.totalPage === 0 ||
                      page >= publicData.meta.totalPage
                    }
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
