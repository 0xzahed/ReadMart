"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Eye, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/admin/SectionHeading";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type BannerItem = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> = {
  message?: string;
  status?: boolean;
  statusCode?: number;
  data?: T | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as ApiResponse<unknown>;
    return payload?.message || fallback;
  } catch {
    return fallback;
  }
};

const buildAssetUrl = (apiBaseUrl: string, mediaUrl: string | null | undefined) => {
  if (!mediaUrl) return "";
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;

  try {
    const base = new URL(apiBaseUrl);
    return `${base.protocol}//${base.host}${mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`}`;
  } catch {
    return mediaUrl;
  }
};

export function AdminBannerPage() {
  const { accessToken } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBannerLoading, setIsBannerLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailBanner, setDetailBanner] = useState<BannerItem | null>(null);

  const isApiReady = useMemo(() => API_BASE_URL.length > 0, []);

  const filteredBanners = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return banners;

    return banners.filter((banner) => {
      return (
        banner.title.toLowerCase().includes(keyword) ||
        banner.url.toLowerCase().includes(keyword)
      );
    });
  }, [banners, searchText]);

  const fetchBanners = useCallback(async () => {
    if (!isApiReady) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: "GET",
      });

      const payload = (await response.json()) as ApiResponse<BannerItem[]>;

      if (!response.ok || !payload?.status) {
        throw new Error(payload?.message || "Failed to fetch banners.");
      }

      setBanners(Array.isArray(payload?.data) ? payload.data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch banners.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isApiReady]);

  useEffect(() => {
    void fetchBanners();
  }, [fetchBanners]);

  const fetchSingleBanner = useCallback(
    async (bannerId: string) => {
      const response = await fetch(`${API_BASE_URL}/banners/${bannerId}`, {
        method: "GET",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      });

      const payload = (await response.json()) as ApiResponse<BannerItem>;

      if (!response.ok || !payload?.status || !payload?.data) {
        throw new Error(payload?.message || "Failed to fetch banner details.");
      }

      return payload.data;
    },
    [accessToken],
  );

  const resetForm = () => {
    setEditingBannerId(null);
    setTitle("");
    setUrl("");
    setImageFile(null);
    setImagePreview("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = async (bannerId: string) => {
    setIsBannerLoading(true);

    try {
      const banner = await fetchSingleBanner(bannerId);
      setEditingBannerId(banner.id);
      setTitle(banner.title);
      setUrl(banner.url);
      setImageFile(null);
      setImagePreview(buildAssetUrl(API_BASE_URL, banner.imageUrl));
      setIsModalOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch banner details.";
      toast.error(message);
    } finally {
      setIsBannerLoading(false);
    }
  };

  const openDetailModal = async (bannerId: string) => {
    setIsBannerLoading(true);
    setIsDetailOpen(true);

    try {
      const banner = await fetchSingleBanner(bannerId);
      setDetailBanner(banner);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch banner details.";
      toast.error(message);
      setIsDetailOpen(false);
      setDetailBanner(null);
    } finally {
      setIsBannerLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setDetailBanner(null);
  };

  const onSelectImage = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      return;
    }

    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle || !trimmedUrl) {
      toast.error("Title and URL are required.");
      return;
    }

    if (!editingBannerId && !imageFile) {
      toast.error("Banner image is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);
      formData.append("url", trimmedUrl);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const isEdit = Boolean(editingBannerId);
      const response = await fetch(
        isEdit ? `${API_BASE_URL}/banners/${editingBannerId}` : `${API_BASE_URL}/banners`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to save banner."));
      }

      const payload = (await response.json()) as ApiResponse<BannerItem>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to save banner.");
      }

      toast.success(payload.message || (isEdit ? "Banner updated successfully." : "Banner created successfully."));
      closeModal();
      await fetchBanners();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save banner.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (banner: BannerItem) => {
    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const shouldDelete = window.confirm(`Delete banner \"${banner.title}\"?`);
    if (!shouldDelete) return;

    setDeletingId(banner.id);

    try {
      const response = await fetch(`${API_BASE_URL}/banners/${banner.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to delete banner."));
      }

      const payload = (await response.json()) as ApiResponse<null>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to delete banner.");
      }

      toast.success(payload.message || "Banner deleted successfully.");
      setBanners((prev) => prev.filter((item) => item.id !== banner.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete banner.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isApiReady) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        NEXT_PUBLIC_API_BASE_URL is missing in frontend env.
      </div>
    );
  }

  return (
    <div>
      <SectionHeading
        title="Banners"
        subtitle="Manage banner CRUD with backend APIs"
        action={(
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchBanners()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Add Banner
            </button>
          </div>
        )}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search banner"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading banners...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-230 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 font-medium">Image</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">URL</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanners.map((banner) => (
                    <tr key={banner.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3">
                        <div className="relative h-10 w-14 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={buildAssetUrl(API_BASE_URL, banner.imageUrl)}
                            alt={banner.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 font-medium text-gray-900">{banner.title}</td>
                      <td className="py-3 text-gray-600">
                        <a href={banner.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                          {banner.url}
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">{formatDateTime(banner.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void openDetailModal(banner.id)}
                            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void openEditModal(banner.id)}
                            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(banner)}
                            disabled={deletingId === banner.id}
                            className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === banner.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBanners.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No banners found.</p>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingBannerId ? "Edit Banner" : "Add Banner"}</h3>
              <button type="button" onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Banner title"
                className="w-full rounded-lg bg-secondary px-3 py-2"
                required
              />

              <input
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg bg-secondary px-3 py-2"
                required
              />

              <div>
                <label className="mb-1 block text-sm font-medium">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => onSelectImage(event.target.files?.[0] || null)}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />

                {imagePreview ? (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-secondary">
                    <Image src={imagePreview} alt="Banner preview" fill unoptimized className="object-cover" />
                  </div>
                ) : null}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 rounded-lg bg-secondary py-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-primary py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : editingBannerId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Banner Details</h3>
              <button type="button" onClick={closeDetailModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {isBannerLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading details...
              </div>
            ) : detailBanner ? (
              <div className="space-y-3">
                <div className="relative h-40 w-full overflow-hidden rounded-lg bg-secondary">
                  <Image
                    src={buildAssetUrl(API_BASE_URL, detailBanner.imageUrl)}
                    alt={detailBanner.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Title</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{detailBanner.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">URL</p>
                  <p className="mt-1 break-all text-sm text-gray-900">{detailBanner.url}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created / Updated</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDateTime(detailBanner.createdAt)} / {formatDateTime(detailBanner.updatedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-500">Banner not found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
