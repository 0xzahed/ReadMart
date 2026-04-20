"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/admin/SectionHeading";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import {
  createFlashSaleCampaign,
  deleteFlashSaleCampaign,
  fetchActiveFlashSaleProducts,
  fetchFlashSaleCampaignById,
  fetchFlashSaleCampaignList,
  getCampaignApiBaseUrl,
  type ActiveFlashSaleProductsResponse,
  type FlashSaleCampaignDetail,
  type FlashSaleCampaignSummary,
  type FlashSaleDiscountType,
  updateFlashSaleCampaignProducts,
  updateFlashSaleCampaignTime,
} from "@/lib/campaignApi";

const parseIds = (value: string): string[] => {
  return Array.from(new Set(value.split(/[\s,]+/g).map((item) => item.trim()).filter(Boolean)));
};

const toInputDateTime = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return offsetDate.toISOString().slice(0, 16);
};

type CreateFormState = {
  title: string;
  startAt: string;
  endAt: string;
  discountType: FlashSaleDiscountType;
  discountValue: string;
  productIds: string;
};

const defaultCreateForm: CreateFormState = {
  title: "",
  startAt: "",
  endAt: "",
  discountType: "PERCENT",
  discountValue: "",
  productIds: "",
};

export function AdminFlashSalePage() {
  const { accessToken } = useAdminAuth();

  const [campaigns, setCampaigns] = useState<FlashSaleCampaignSummary[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 0 });
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<FlashSaleCampaignDetail | null>(null);
  const [activePreview, setActivePreview] = useState<ActiveFlashSaleProductsResponse | null>(null);

  const [createForm, setCreateForm] = useState<CreateFormState>(defaultCreateForm);
  const [timeStartAt, setTimeStartAt] = useState("");
  const [timeEndAt, setTimeEndAt] = useState("");
  const [addProductIds, setAddProductIds] = useState("");
  const [removeProductIds, setRemoveProductIds] = useState("");

  const [isListLoading, setIsListLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApiReady = useMemo(() => getCampaignApiBaseUrl().length > 0, []);

  const loadCampaigns = useCallback(async () => {
    if (!isApiReady || !accessToken) return;

    setIsListLoading(true);

    try {
      const payload = await fetchFlashSaleCampaignList(
        {
          page: meta.page,
          limit: meta.limit,
        },
        accessToken,
      );

      setCampaigns(payload.campaigns);
      setMeta(payload.meta);

      if (payload.campaigns.length > 0 && !selectedCampaignId) {
        const firstId = payload.campaigns[0]?.id;

        if (firstId) {
          setSelectedCampaignId(firstId);
        }
      }

      if (
        selectedCampaignId &&
        payload.campaigns.length > 0 &&
        !payload.campaigns.some((campaign) => campaign.id === selectedCampaignId)
      ) {
        const firstId = payload.campaigns[0]?.id ?? "";
        setSelectedCampaignId(firstId);
      }

      if (selectedCampaignId && payload.campaigns.length === 0) {
        setSelectedCampaignId("");
        setSelectedCampaign(null);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch flash sale campaigns.");
    } finally {
      setIsListLoading(false);
    }
  }, [accessToken, isApiReady, meta.limit, meta.page, selectedCampaignId]);

  const loadCampaignDetail = useCallback(async () => {
    if (!isApiReady || !accessToken || !selectedCampaignId) {
      setSelectedCampaign(null);
      return;
    }

    setIsDetailLoading(true);

    try {
      const payload = await fetchFlashSaleCampaignById(selectedCampaignId, accessToken);
      setSelectedCampaign(payload);
      setTimeStartAt(toInputDateTime(payload.startAt));
      setTimeEndAt(toInputDateTime(payload.endAt));
    } catch (error) {
      setSelectedCampaign(null);
      toast.error(error instanceof Error ? error.message : "Failed to fetch flash sale campaign details.");
    } finally {
      setIsDetailLoading(false);
    }
  }, [accessToken, isApiReady, selectedCampaignId]);

  const loadActivePreview = useCallback(async () => {
    if (!isApiReady) return;

    try {
      const payload = await fetchActiveFlashSaleProducts({ page: 1, limit: 10 });
      setActivePreview(payload);
    } catch (error) {
      setActivePreview(null);
      toast.error(error instanceof Error ? error.message : "Failed to fetch active flash sale preview.");
    }
  }, [isApiReady]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    void loadCampaignDetail();
  }, [loadCampaignDetail]);

  useEffect(() => {
    void loadActivePreview();
  }, [loadActivePreview]);

  const handleCreateCampaign = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const productIds = parseIds(createForm.productIds);

    if (productIds.length === 0) {
      toast.error("At least one product ID is required.");
      return;
    }

    if (!createForm.startAt || !createForm.endAt) {
      toast.error("Start and end time are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = await createFlashSaleCampaign(
        {
          title: createForm.title.trim(),
          startAt: new Date(createForm.startAt).toISOString(),
          endAt: new Date(createForm.endAt).toISOString(),
          discountType: createForm.discountType,
          discountValue: Number(createForm.discountValue),
          productIds,
        },
        accessToken,
      );

      toast.success("Flash sale campaign created successfully.");
      setCreateForm(defaultCreateForm);
      setSelectedCampaignId(payload.id);

      await Promise.all([loadCampaigns(), loadActivePreview()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create flash sale campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTime = async () => {
    if (!accessToken || !selectedCampaignId) {
      toast.error("Please select a campaign first.");
      return;
    }

    const payload: { startAt?: string; endAt?: string } = {};

    if (timeStartAt.trim()) {
      payload.startAt = new Date(timeStartAt).toISOString();
    }

    if (timeEndAt.trim()) {
      payload.endAt = new Date(timeEndAt).toISOString();
    }

    if (!payload.startAt && !payload.endAt) {
      toast.error("Enter start or end time to update.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateFlashSaleCampaignTime(selectedCampaignId, payload, accessToken);
      toast.success("Flash sale campaign time updated.");
      await Promise.all([loadCampaigns(), loadCampaignDetail(), loadActivePreview()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update campaign time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProducts = async () => {
    if (!accessToken || !selectedCampaignId) {
      toast.error("Please select a campaign first.");
      return;
    }

    const addIds = parseIds(addProductIds);
    const removeIds = parseIds(removeProductIds);

    if (addIds.length === 0 && removeIds.length === 0) {
      toast.error("Add or remove at least one product ID.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateFlashSaleCampaignProducts(
        selectedCampaignId,
        {
          addProductIds: addIds.length > 0 ? addIds : undefined,
          removeProductIds: removeIds.length > 0 ? removeIds : undefined,
        },
        accessToken,
      );

      toast.success("Flash sale products updated.");
      setAddProductIds("");
      setRemoveProductIds("");
      await Promise.all([loadCampaigns(), loadCampaignDetail(), loadActivePreview()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update campaign products.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!accessToken || !selectedCampaignId) {
      toast.error("Please select a campaign first.");
      return;
    }

    if (!window.confirm("Delete this campaign? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteFlashSaleCampaign(selectedCampaignId, accessToken);
      toast.success("Flash sale campaign deleted.");
      setSelectedCampaignId("");
      setSelectedCampaign(null);
      await Promise.all([loadCampaigns(), loadActivePreview()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete campaign.");
    } finally {
      setIsSubmitting(false);
    }
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
        title="Flash Sale"
        subtitle="Create and manage flash sale campaigns from backend APIs."
        action={(
          <button
            type="button"
            onClick={() => {
              void loadCampaigns();
              void loadActivePreview();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        )}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <form onSubmit={handleCreateCampaign} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Create Campaign</h3>
          <input
            value={createForm.title}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Campaign title"
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            required
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="datetime-local"
              value={createForm.startAt}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, startAt: event.target.value }))}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
              required
            />
            <input
              type="datetime-local"
              value={createForm.endAt}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, endAt: event.target.value }))}
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
              required
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={createForm.discountType}
              onChange={(event) =>
                setCreateForm((prev) => ({ ...prev, discountType: event.target.value as FlashSaleDiscountType }))
              }
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
            >
              <option value="PERCENT">PERCENT</option>
              <option value="TAKA">TAKA</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={createForm.discountValue}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, discountValue: event.target.value }))}
              placeholder="Discount value"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none transition focus:border-primary"
              required
            />
          </div>
          <textarea
            value={createForm.productIds}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, productIds: event.target.value }))}
            rows={4}
            placeholder="Product IDs (comma, space or newline separated)"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-primary"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create Campaign
          </button>
        </form>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">Active Preview</h3>
          {activePreview?.campaign ? (
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-semibold">Title:</span> {activePreview.campaign.title}</p>
              <p><span className="font-semibold">Status:</span> {activePreview.campaign.status}</p>
              <p><span className="font-semibold">Remaining:</span> {activePreview.campaign.remainingSeconds}s</p>
              <p><span className="font-semibold">Products:</span> {activePreview.meta.total}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active flash sale campaign.</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-gray-900">Campaign List</h3>

          {isListLoading ? (
            <p className="text-sm text-muted-foreground">Loading campaigns...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No campaigns found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Products</th>
                    <th className="pb-3 font-medium">End</th>
                    <th className="pb-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className={`border-b border-gray-100 last:border-b-0 ${
                        selectedCampaignId === campaign.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-3 text-gray-900">{campaign.title}</td>
                      <td className="py-3 text-gray-700">{campaign.status}</td>
                      <td className="py-3 text-gray-700">{campaign.productCount}</td>
                      <td className="py-3 text-gray-700">{new Date(campaign.endAt).toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCampaignId(campaign.id)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-muted-foreground">
              Page {meta.page} of {Math.max(meta.totalPage, 1)}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMeta((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
                disabled={meta.page <= 1 || isListLoading}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setMeta((prev) => ({
                    ...prev,
                    page: prev.totalPage === 0 ? prev.page : Math.min(prev.page + 1, prev.totalPage),
                  }))
                }
                disabled={isListLoading || meta.totalPage === 0 || meta.page >= meta.totalPage}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Campaign Detail</h3>
            <button
              type="button"
              onClick={handleDeleteCampaign}
              disabled={!selectedCampaignId || isSubmitting}
              className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>

          {isDetailLoading ? (
            <p className="text-sm text-muted-foreground">Loading campaign details...</p>
          ) : !selectedCampaign ? (
            <p className="text-sm text-muted-foreground">Select a campaign to view details.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
                <p><span className="font-medium">Title:</span> {selectedCampaign.title}</p>
                <p><span className="font-medium">Status:</span> {selectedCampaign.status}</p>
                <p><span className="font-medium">Range:</span> {new Date(selectedCampaign.startAt).toLocaleString()} - {new Date(selectedCampaign.endAt).toLocaleString()}</p>
              </div>

              <div className="space-y-2 rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">Update Time</p>
                <div className="grid gap-2">
                  <input
                    type="datetime-local"
                    value={timeStartAt}
                    onChange={(event) => setTimeStartAt(event.target.value)}
                    className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-sm outline-none transition focus:border-primary"
                  />
                  <input
                    type="datetime-local"
                    value={timeEndAt}
                    onChange={(event) => setTimeEndAt(event.target.value)}
                    className="h-9 rounded-md border border-gray-200 bg-gray-50 px-2 text-sm outline-none transition focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateTime}
                    disabled={isSubmitting}
                    className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-70"
                  >
                    Save Time
                  </button>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">Update Products</p>
                <textarea
                  rows={3}
                  value={addProductIds}
                  onChange={(event) => setAddProductIds(event.target.value)}
                  placeholder="Add Product IDs"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none transition focus:border-primary"
                />
                <textarea
                  rows={3}
                  value={removeProductIds}
                  onChange={(event) => setRemoveProductIds(event.target.value)}
                  placeholder="Remove Product IDs"
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none transition focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleUpdateProducts}
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-70"
                >
                  Save Products
                </button>
              </div>

              <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="font-medium text-gray-900">Products in Campaign ({selectedCampaign.products.length})</p>
                <div className="max-h-42 overflow-y-auto space-y-1">
                  {selectedCampaign.products.map((item) => (
                    <p key={item.id} className="text-xs text-gray-700">
                      {item.product.title} ({item.productId})
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
