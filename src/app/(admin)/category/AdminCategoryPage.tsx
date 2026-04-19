"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Edit2, Loader2, Plus, RefreshCcw, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { SectionHeading } from "@/components/admin/SectionHeading";

type CategoryItem = {
  id: string;
  title: string;
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

type CategoriesListData = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  categories: CategoryItem[];
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

const buildAssetUrl = (apiBaseUrl: string, imageUrl: string) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;

  try {
    const base = new URL(apiBaseUrl);
    return `${base.protocol}//${base.host}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
  } catch {
    return imageUrl;
  }
};

export function AdminCategoryPage() {
  const { accessToken } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const isApiReady = useMemo(() => API_BASE_URL.length > 0, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter((category) => category.title.toLowerCase().includes(keyword));
  }, [categories, searchText]);

  const fetchCategories = useCallback(async () => {
    if (!isApiReady) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/categories?page=1&limit=100`, {
        method: "GET",
      });

      const payload = (await response.json()) as ApiResponse<CategoriesListData>;

      if (!response.ok || !payload?.status) {
        throw new Error(payload?.message || "Failed to fetch categories.");
      }

      setCategories(Array.isArray(payload?.data?.categories) ? payload.data.categories : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [isApiReady]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setTitle("");
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const openEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setTitle(category.title);
    setImageFile(null);
    setImagePreview(buildAssetUrl(API_BASE_URL, category.imageUrl));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setTitle("");
    setImageFile(null);
    setImagePreview("");
  };

  const onSelectImage = (file: File | null) => {
    setImageFile(file);

    if (!file) {
      setImagePreview(editingCategory ? buildAssetUrl(API_BASE_URL, editingCategory.imageUrl) : "");
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
    if (!trimmedTitle) {
      toast.error("Category title is required.");
      return;
    }

    if (!editingCategory && !imageFile) {
      toast.error("Category image is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", trimmedTitle);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const isEdit = Boolean(editingCategory);
      const response = await fetch(
        isEdit
          ? `${API_BASE_URL}/categories/${editingCategory?.id}`
          : `${API_BASE_URL}/categories`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to save category."));
      }

      const payload = (await response.json()) as ApiResponse<CategoryItem>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to save category.");
      }

      toast.success(payload.message || (isEdit ? "Category updated." : "Category created."));
      closeModal();
      await fetchCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save category.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: CategoryItem) => {
    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const shouldDelete = window.confirm(`Delete category "${category.title}"?`);
    if (!shouldDelete) return;

    setDeletingId(category.id);

    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to delete category."));
      }

      const payload = (await response.json()) as ApiResponse<null>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to delete category.");
      }

      toast.success(payload.message || "Category deleted.");
      setCategories((prev) => prev.filter((item) => item.id !== category.id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category.";
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
        title="Categories"
        subtitle="Manage category CRUD directly from backend APIs"
        action={(
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        )}
      />

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search category"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>

          <button
            type="button"
            onClick={() => void fetchCategories()}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading categories...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 font-medium">Image</th>
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={buildAssetUrl(API_BASE_URL, category.imageUrl)}
                            alt={category.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 font-medium text-gray-900">{category.title}</td>
                      <td className="py-3 text-gray-600">{formatDateTime(category.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => void handleDelete(category)}
                            disabled={deletingId === category.id}
                            className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === category.id ? (
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

            {filteredCategories.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No categories found.</p>
            )}
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingCategory ? "Edit" : "Add"} Category</h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Category title"
                className="w-full rounded-lg bg-secondary px-3 py-2"
                required
              />

              <div>
                <label className="mb-1 block text-sm font-medium">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => onSelectImage(event.target.files?.[0] || null)}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />

                {imagePreview && (
                  <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg bg-secondary">
                    <Image src={imagePreview} alt="Category preview" fill unoptimized className="object-cover" />
                  </div>
                )}
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
                  {isSubmitting ? "Saving..." : editingCategory ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
