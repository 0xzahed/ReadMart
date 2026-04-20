"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Copy,
  Edit2,
  Eye,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { SectionHeading } from "@/components/admin/SectionHeading";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

type ProductStatus =
  | "PENDING"
  | "PROCESSING"
  | "HOLD"
  | "PICKUP"
  | "DELIVERED"
  | "PARTIAL"
  | "REJECT"
  | "CANCEL"
  | "NOT_COMPLETED"
  | "TRASH";

type CategoryItem = {
  id: string;
  title: string;
};

type SubCategoryItem = {
  id: string;
  categoryId: string;
  title: string;
};

type ProductListItem = {
  id: string;
  title: string;
  stock: boolean;
  availability: boolean;
  isFreeDelivery?: boolean;
  category: CategoryItem;
  subCategory: CategoryItem;
  firstVariant: {
    actualPrice: string;
    discountedPrice: string;
    color: string;
    size: string;
    imageUrl: string;
  } | null;
};

type ProductDetailVariant = {
  id: string;
  actualPrice: string;
  discountedPrice: string;
  color: string;
  size: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

type ProductDelta = {
  ops?: Array<{
    insert?: string;
    attributes?: Record<string, unknown>;
  }>;
};

type ProductDetail = {
  id: string;
  categoryId: string;
  subCategoryId: string;
  title: string;
  slug: string;
  descriptionDelta: ProductDelta;
  descriptionHtml: string;
  extraDescriptionDelta: ProductDelta | null;
  extraDescriptionHtml: string | null;
  weight: string;
  material: string;
  stock: boolean;
  availability: boolean;
  status: ProductStatus;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category: CategoryItem;
  subCategory: CategoryItem;
  variants: ProductDetailVariant[];
};

type ProductsListData = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  products: ProductListItem[];
};

type CategoriesListData = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  categories: CategoryItem[];
};

type SubCategoriesListData = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  subCategories: SubCategoryItem[];
};

type ApiResponse<T> = {
  message?: string;
  status?: boolean;
  statusCode?: number;
  data?: T | null;
};

type ProductVariantInput = {
  actualPrice: string;
  discountedPrice: string;
  color: string;
  size: string;
  imageFile: File | null;
  imagePreview: string;
};

type ProductFormState = {
  categoryId: string;
  subCategoryId: string;
  title: string;
  descriptionText: string;
  extraDescriptionText: string;
  weight: string;
  material: string;
  stock: boolean;
  availability: boolean;
  status: ProductStatus;
  variants: ProductVariantInput[];
  videoFile: File | null;
};

const PRODUCT_STATUS_OPTIONS: ProductStatus[] = [
  "PENDING",
  "PROCESSING",
  "HOLD",
  "PICKUP",
  "DELIVERED",
  "PARTIAL",
  "REJECT",
  "CANCEL",
  "NOT_COMPLETED",
  "TRASH",
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";
const MAX_LIST_LIMIT = 100;

const createEmptyVariant = (): ProductVariantInput => ({
  actualPrice: "",
  discountedPrice: "",
  color: "",
  size: "",
  imageFile: null,
  imagePreview: "",
});

const getDefaultFormState = (
  categories: CategoryItem[],
  subCategories: SubCategoryItem[],
): ProductFormState => {
  const firstCategoryId = categories[0]?.id ?? "";
  const firstSubCategoryId =
    subCategories.find((item) => item.categoryId === firstCategoryId)?.id ?? "";

  return {
    categoryId: firstCategoryId,
    subCategoryId: firstSubCategoryId,
    title: "",
    descriptionText: "",
    extraDescriptionText: "",
    weight: "",
    material: "",
    stock: true,
    availability: true,
    status: "PENDING",
    variants: [createEmptyVariant()],
    videoFile: null,
  };
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
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

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as ApiResponse<unknown>;
    return payload?.message || fallback;
  } catch {
    return fallback;
  }
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const plainTextToDelta = (value: string): ProductDelta => ({
  ops: [
    {
      insert: value.endsWith("\n") ? value : `${value}\n`,
    },
  ],
});

const plainTextToHtml = (value: string): string => {
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return "<p></p>";
  }

  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
};

const deltaToPlainText = (delta: ProductDelta | null | undefined): string => {
  if (!delta?.ops || !Array.isArray(delta.ops)) {
    return "";
  }

  return delta.ops
    .map((operation) => (typeof operation.insert === "string" ? operation.insert : ""))
    .join("")
    .replace(/\n+$/g, "")
    .trim();
};

export function AdminProductsPage() {
  const { accessToken } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>([]);

  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPage: 0 });

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [replaceVariants, setReplaceVariants] = useState(false);
  const [form, setForm] = useState<ProductFormState>(() => getDefaultFormState([], []));

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailProduct, setDetailProduct] = useState<ProductDetail | null>(null);

  const isApiReady = useMemo(() => API_BASE_URL.length > 0, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchText]);

  const fetchCategories = useCallback(async () => {
    if (!isApiReady) return;

    try {
      let page = 1;
      let totalPage = 1;
      const nextCategories: CategoryItem[] = [];

      while (page <= totalPage) {
        const response = await fetch(`${API_BASE_URL}/categories?page=${page}&limit=${MAX_LIST_LIMIT}`, {
          method: "GET",
        });

        const payload = (await response.json()) as ApiResponse<CategoriesListData>;

        if (!response.ok || !payload?.status) {
          throw new Error(payload?.message || "Failed to fetch categories.");
        }

        if (Array.isArray(payload?.data?.categories)) {
          nextCategories.push(...payload.data.categories);
        }

        totalPage = payload?.data?.meta?.totalPage ?? page;
        page += 1;
      }

      setCategories(nextCategories);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories.";
      toast.error(message);
    }
  }, [isApiReady]);

  const fetchSubCategories = useCallback(async () => {
    if (!isApiReady) return;

    try {
      let page = 1;
      let totalPage = 1;
      const nextSubCategories: SubCategoryItem[] = [];

      while (page <= totalPage) {
        const response = await fetch(`${API_BASE_URL}/subcategories?page=${page}&limit=${MAX_LIST_LIMIT}`, {
          method: "GET",
        });

        const payload = (await response.json()) as ApiResponse<SubCategoriesListData>;

        if (!response.ok || !payload?.status) {
          throw new Error(payload?.message || "Failed to fetch subcategories.");
        }

        if (Array.isArray(payload?.data?.subCategories)) {
          nextSubCategories.push(...payload.data.subCategories);
        }

        totalPage = payload?.data?.meta?.totalPage ?? page;
        page += 1;
      }

      setSubCategories(nextSubCategories);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch subcategories.";
      toast.error(message);
    }
  }, [isApiReady]);

  const fetchProducts = useCallback(async () => {
    if (!isApiReady || !accessToken) return;

    setIsLoading(true);

    try {
      const queryParams = new URLSearchParams({
        page: "1",
        limit: "100",
      });

      const trimmedSearch = debouncedSearchText.trim();
      if (trimmedSearch) queryParams.set("search", trimmedSearch);
      if (categoryFilter !== "all") queryParams.set("categoryId", categoryFilter);
      if (subCategoryFilter !== "all") queryParams.set("subCategoryId", subCategoryFilter);

      const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = (await response.json()) as ApiResponse<ProductsListData>;

      if (!response.ok || !payload?.status) {
        throw new Error(payload?.message || "Failed to fetch products.");
      }

      setProducts(Array.isArray(payload?.data?.products) ? payload.data.products : []);

      setMeta({
        page: payload?.data?.meta?.page ?? 1,
        limit: payload?.data?.meta?.limit ?? 10,
        total: payload?.data?.meta?.total ?? 0,
        totalPage: payload?.data?.meta?.totalPage ?? 0,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch products.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, categoryFilter, debouncedSearchText, isApiReady, subCategoryFilter]);

  useEffect(() => {
    void fetchCategories();
    void fetchSubCategories();
  }, [fetchCategories, fetchSubCategories]);

  useEffect(() => {
    if (!accessToken) {
      setProducts([]);
      return;
    }

    void fetchProducts();
  }, [accessToken, fetchProducts]);

  const filterScopedSubCategories = useMemo(() => {
    if (categoryFilter === "all") {
      return subCategories;
    }

    return subCategories.filter((item) => item.categoryId === categoryFilter);
  }, [categoryFilter, subCategories]);

  useEffect(() => {
    if (
      subCategoryFilter !== "all" &&
      !filterScopedSubCategories.some((item) => item.id === subCategoryFilter)
    ) {
      setSubCategoryFilter("all");
    }
  }, [filterScopedSubCategories, subCategoryFilter]);

  const formScopedSubCategories = useMemo(
    () => subCategories.filter((item) => item.categoryId === form.categoryId),
    [form.categoryId, subCategories],
  );

  const fetchSingleProduct = useCallback(
    async (productId: string) => {
      if (!accessToken) {
        throw new Error("Admin token missing. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = (await response.json()) as ApiResponse<ProductDetail>;

      if (!response.ok || !payload?.status || !payload?.data) {
        throw new Error(payload?.message || "Failed to fetch product details.");
      }

      return payload.data;
    },
    [accessToken],
  );

  const openCreateModal = () => {
    setEditingProductId(null);
    setReplaceVariants(false);
    setForm(getDefaultFormState(categories, subCategories));
    setIsFormOpen(true);
  };

  const openEditModal = async (productId: string) => {
    setIsDetailLoading(true);

    try {
      const product = await fetchSingleProduct(productId);

      setEditingProductId(product.id);
      setReplaceVariants(false);

      setForm({
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        title: product.title,
        descriptionText: deltaToPlainText(product.descriptionDelta),
        extraDescriptionText: deltaToPlainText(product.extraDescriptionDelta),
        weight: product.weight,
        material: product.material,
        stock: product.stock,
        availability: product.availability,
        status: product.status,
        variants: product.variants.map((variant) => ({
          actualPrice: variant.actualPrice,
          discountedPrice: variant.discountedPrice,
          color: variant.color,
          size: variant.size,
          imageFile: null,
          imagePreview: buildAssetUrl(API_BASE_URL, variant.imageUrl),
        })),
        videoFile: null,
      });

      setIsFormOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load product for editing.";
      toast.error(message);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const openDetailModal = async (productId: string) => {
    setIsDetailLoading(true);
    setIsDetailOpen(true);

    try {
      const product = await fetchSingleProduct(productId);
      setDetailProduct(product);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch product details.";
      toast.error(message);
      setIsDetailOpen(false);
      setDetailProduct(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingProductId(null);
    setReplaceVariants(false);
  };

  const closeDetailModal = () => {
    setIsDetailOpen(false);
    setDetailProduct(null);
  };

  const handleFormCategoryChange = (value: string) => {
    const nextSubCategoryId = subCategories.find((item) => item.categoryId === value)?.id ?? "";

    setForm((prev) => ({
      ...prev,
      categoryId: value,
      subCategoryId: nextSubCategoryId,
    }));
  };

  const addVariantRow = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  };

  const removeVariantRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateVariantField = (
    index: number,
    key: keyof Omit<ProductVariantInput, "imageFile" | "imagePreview">,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, itemIndex) =>
        itemIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const handleVariantImageChange = (index: number, file: File | null) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, itemIndex) => {
        if (itemIndex !== index) return variant;

        return {
          ...variant,
          imageFile: file,
          imagePreview: file ? URL.createObjectURL(file) : variant.imagePreview,
        };
      }),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.descriptionText.trim();
    const trimmedWeight = form.weight.trim();
    const trimmedMaterial = form.material.trim();
    const trimmedExtraDescription = form.extraDescriptionText.trim();

    if (
      !form.categoryId ||
      !form.subCategoryId ||
      !trimmedTitle ||
      !trimmedDescription ||
      !trimmedWeight ||
      !trimmedMaterial
    ) {
      toast.error("Please fill all required product fields.");
      return;
    }

    const shouldSendVariants = !editingProductId || replaceVariants;

    const variantPayload: Array<{
      actualPrice: number;
      discountedPrice: number;
      color: string;
      size: string;
      imageFile: File;
    }> = [];

    if (shouldSendVariants) {
      if (form.variants.length === 0) {
        toast.error("At least one variant is required.");
        return;
      }

      for (const variant of form.variants) {
        const actualPrice = Number(variant.actualPrice);
        const discountedPrice = Number(variant.discountedPrice);
        const color = variant.color.trim();
        const size = variant.size.trim();

        if (!Number.isFinite(actualPrice) || actualPrice <= 0) {
          toast.error("Variant actual price must be greater than 0.");
          return;
        }

        if (!Number.isFinite(discountedPrice) || discountedPrice < 0 || discountedPrice > actualPrice) {
          toast.error("Variant discounted price must be between 0 and actual price.");
          return;
        }

        if (!color || !size) {
          toast.error("Each variant must include color and size.");
          return;
        }

        if (!variant.imageFile) {
          toast.error("Each variant needs an image when creating or replacing variants.");
          return;
        }

        variantPayload.push({
          actualPrice,
          discountedPrice,
          color,
          size,
          imageFile: variant.imageFile,
        });
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("categoryId", form.categoryId);
      formData.append("subCategoryId", form.subCategoryId);
      formData.append("title", trimmedTitle);
      formData.append("descriptionDelta", JSON.stringify(plainTextToDelta(trimmedDescription)));
      formData.append("descriptionHtml", plainTextToHtml(trimmedDescription));
      formData.append("weight", trimmedWeight);
      formData.append("material", trimmedMaterial);
      formData.append("stock", String(form.stock));
      formData.append("availability", String(form.availability));
      formData.append("status", form.status);

      if (trimmedExtraDescription) {
        formData.append("extraDescriptionDelta", JSON.stringify(plainTextToDelta(trimmedExtraDescription)));
        formData.append("extraDescriptionHtml", plainTextToHtml(trimmedExtraDescription));
      }

      if (shouldSendVariants) {
        formData.append(
          "variants",
          JSON.stringify(
            variantPayload.map((variant) => ({
              actualPrice: variant.actualPrice,
              discountedPrice: variant.discountedPrice,
              color: variant.color,
              size: variant.size,
            })),
          ),
        );

        variantPayload.forEach((variant) => {
          formData.append("variantImages", variant.imageFile);
        });
      }

      if (form.videoFile) {
        formData.append("video", form.videoFile);
      }

      const isEdit = Boolean(editingProductId);
      const response = await fetch(
        isEdit ? `${API_BASE_URL}/products/${editingProductId}` : `${API_BASE_URL}/products`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to save product."));
      }

      const payload = (await response.json()) as ApiResponse<ProductDetail>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to save product.");
      }

      toast.success(payload.message || (isEdit ? "Product updated successfully" : "Product created successfully"));
      closeFormModal();
      await fetchProducts();
      window.dispatchEvent(new Event("readmart:storefront-updated"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save product.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (product: ProductListItem) => {
    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const shouldCopy = window.confirm(`Copy product \"${product.title}\"?`);
    if (!shouldCopy) return;

    setCopyingId(product.id);

    try {
      const response = await fetch(`${API_BASE_URL}/products/${product.id}/copy`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to copy product."));
      }

      const payload = (await response.json()) as ApiResponse<ProductDetail>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to copy product.");
      }

      toast.success(payload.message || "Product copied successfully.");
      await fetchProducts();
      window.dispatchEvent(new Event("readmart:storefront-updated"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to copy product.";
      toast.error(message);
    } finally {
      setCopyingId(null);
    }
  };

  const handleDelete = async (product: ProductListItem) => {
    if (!accessToken) {
      toast.error("Admin token missing. Please login again.");
      return;
    }

    const shouldDelete = window.confirm(`Delete product \"${product.title}\"?`);
    if (!shouldDelete) return;

    setDeletingId(product.id);

    try {
      const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to delete product."));
      }

      const payload = (await response.json()) as ApiResponse<null>;

      if (!payload?.status) {
        throw new Error(payload?.message || "Failed to delete product.");
      }

      toast.success(payload.message || "Product deleted successfully.");
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
      window.dispatchEvent(new Event("readmart:storefront-updated"));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete product.";
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

  if (!accessToken) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Admin token missing. Please login again.
      </div>
    );
  }

  return (
    <div>
      <SectionHeading
        title="Products"
        subtitle="Handle product CRUD with copy/delete and backend-based list"
        action={(
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchProducts()}
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
              Add Product
            </button>
          </div>
        )}
      />

      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Total</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{meta.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Page</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{meta.page}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Limit</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{meta.limit}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-500">Total Page</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{meta.totalPage}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>

          <select
            value={subCategoryFilter}
            onChange={(event) => setSubCategoryFilter(event.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Subcategories</option>
            {filterScopedSubCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.title}
              </option>
            ))}
          </select>

          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search product"
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading products...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-260 text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Subcategory</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Availability</th>
                    <th className="pb-3 font-medium">Free Delivery</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 overflow-hidden rounded-md bg-gray-100">
                            {product.firstVariant?.imageUrl ? (
                              <Image
                                src={buildAssetUrl(API_BASE_URL, product.firstVariant.imageUrl)}
                                alt={product.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-500">{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">{product.category?.title || "-"}</td>
                      <td className="py-3 text-gray-700">{product.subCategory?.title || "-"}</td>
                      <td className="py-3">
                        {product.firstVariant ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              Tk {Number(product.firstVariant.discountedPrice).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 line-through">
                              Tk {Number(product.firstVariant.actualPrice).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.stock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {product.stock ? "In stock" : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.availability
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.availability ? "Available" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.isFreeDelivery
                              ? "bg-violet-100 text-violet-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.isFreeDelivery ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void openDetailModal(product.id)}
                            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void openEditModal(product.id)}
                            className="rounded-md border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleCopy(product)}
                            disabled={copyingId === product.id}
                            className="rounded-md border border-sky-200 p-2 text-sky-600 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {copyingId === product.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(product)}
                            disabled={deletingId === product.id}
                            className="rounded-md border border-rose-200 p-2 text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === product.id ? (
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

            {products.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-500">No products found.</p>
            )}
          </>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingProductId ? "Edit Product" : "Add Product"}</h3>
              <button type="button" onClick={closeFormModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={form.categoryId}
                  onChange={(event) => handleFormCategoryChange(event.target.value)}
                  className="w-full rounded-lg bg-secondary px-3 py-2"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>

                <select
                  value={form.subCategoryId}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, subCategoryId: event.target.value }))
                  }
                  className="w-full rounded-lg bg-secondary px-3 py-2"
                  required
                >
                  <option value="">Select subcategory</option>
                  {formScopedSubCategories.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.title}
                    </option>
                  ))}
                </select>
              </div>

              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Product title"
                className="w-full rounded-lg bg-secondary px-3 py-2"
                required
              />

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  value={form.weight}
                  onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
                  placeholder="Weight (e.g. 500g)"
                  className="w-full rounded-lg bg-secondary px-3 py-2"
                  required
                />
                <input
                  type="text"
                  value={form.material}
                  onChange={(event) => setForm((prev) => ({ ...prev, material: event.target.value }))}
                  placeholder="Material"
                  className="w-full rounded-lg bg-secondary px-3 py-2"
                  required
                />
              </div>

              <textarea
                value={form.descriptionText}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, descriptionText: event.target.value }))
                }
                placeholder="Description text"
                className="min-h-28 w-full rounded-lg bg-secondary px-3 py-2"
                required
              />

              <textarea
                value={form.extraDescriptionText}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, extraDescriptionText: event.target.value }))
                }
                placeholder="Extra description text (optional)"
                className="min-h-24 w-full rounded-lg bg-secondary px-3 py-2"
              />

              <div className="grid gap-3 md:grid-cols-3">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value as ProductStatus }))
                  }
                  className="w-full rounded-lg bg-secondary px-3 py-2"
                >
                  {PRODUCT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.stock}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, stock: event.target.checked }))
                    }
                    className="h-4 w-4"
                  />
                  Stock Available
                </label>

                <label className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.availability}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, availability: event.target.checked }))
                    }
                    className="h-4 w-4"
                  />
                  Visibility Active
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Video (optional)</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0] || null;
                    setForm((prev) => ({ ...prev, videoFile: file }));
                  }}
                  className="w-full rounded-lg bg-secondary px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                />
                {form.videoFile ? (
                  <p className="mt-1 text-xs text-gray-500">Selected: {form.videoFile.name}</p>
                ) : null}
              </div>

              {editingProductId ? (
                <label className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <input
                    type="checkbox"
                    checked={replaceVariants}
                    onChange={(event) => setReplaceVariants(event.target.checked)}
                    className="h-4 w-4"
                  />
                  Replace variants and upload new variant images
                </label>
              ) : null}

              {!editingProductId || replaceVariants ? (
                <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Variants</h4>
                    <button
                      type="button"
                      onClick={addVariantRow}
                      className="text-sm font-medium text-primary"
                    >
                      + Add Variant
                    </button>
                  </div>

                  {form.variants.map((variant, index) => (
                    <div key={`variant-${index}`} className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
                      <div className="grid gap-2 md:grid-cols-4">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.actualPrice}
                          onChange={(event) => updateVariantField(index, "actualPrice", event.target.value)}
                          placeholder="Actual price"
                          className="rounded-lg bg-white px-3 py-2"
                          required
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.discountedPrice}
                          onChange={(event) => updateVariantField(index, "discountedPrice", event.target.value)}
                          placeholder="Discounted price"
                          className="rounded-lg bg-white px-3 py-2"
                          required
                        />
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(event) => updateVariantField(index, "color", event.target.value)}
                          placeholder="Color"
                          className="rounded-lg bg-white px-3 py-2"
                          required
                        />
                        <input
                          type="text"
                          value={variant.size}
                          onChange={(event) => updateVariantField(index, "size", event.target.value)}
                          placeholder="Size"
                          className="rounded-lg bg-white px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleVariantImageChange(index, event.target.files?.[0] || null)
                          }
                          className="w-full rounded-lg bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground"
                          required={!editingProductId || replaceVariants}
                        />
                      </div>

                      {variant.imagePreview ? (
                        <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-200 bg-white">
                          <Image
                            src={variant.imagePreview}
                            alt={`Variant ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      {form.variants.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => removeVariantRow(index)}
                          className="text-xs font-medium text-rose-600"
                        >
                          Remove variant
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                  Existing variants will remain unchanged unless you enable &quot;Replace variants&quot;.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="flex-1 rounded-lg bg-secondary py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-primary py-2 text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : editingProductId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Product Details</h3>
              <button type="button" onClick={closeDetailModal}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {isDetailLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading details...
              </div>
            ) : detailProduct ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Title</p>
                    <p className="mt-1 font-medium text-gray-900">{detailProduct.title}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Slug</p>
                    <p className="mt-1 font-medium text-gray-900 break-all">{detailProduct.slug}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Category / Subcategory</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {detailProduct.category?.title || "-"} / {detailProduct.subCategory?.title || "-"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="mt-1 font-medium text-gray-900">{detailProduct.status}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Weight / Material</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {detailProduct.weight} / {detailProduct.material}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Created / Updated</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDateTime(detailProduct.createdAt)} / {formatDateTime(detailProduct.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                    {deltaToPlainText(detailProduct.descriptionDelta) || "-"}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Extra Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                    {deltaToPlainText(detailProduct.extraDescriptionDelta) || "-"}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Variants ({detailProduct.variants.length})</h4>
                  <div className="space-y-2">
                    {detailProduct.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 p-3"
                      >
                        <div className="relative h-14 w-14 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={buildAssetUrl(API_BASE_URL, variant.imageUrl)}
                            alt={`${detailProduct.title}-${variant.color}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm text-gray-800">
                          <p>
                            <span className="font-medium">Color:</span> {variant.color}
                          </p>
                          <p>
                            <span className="font-medium">Size:</span> {variant.size}
                          </p>
                        </div>
                        <div className="text-sm text-gray-800">
                          <p>
                            <span className="font-medium">Actual:</span> Tk 
                            {Number(variant.actualPrice).toLocaleString()}
                          </p>
                          <p>
                            <span className="font-medium">Discounted:</span> Tk 
                            {Number(variant.discountedPrice).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">Product details not found.</p>
            )}
          </div>
        </div>
      )}

      {isDetailLoading && !isDetailOpen && (
        <div className="fixed bottom-4 right-4 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm">
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}
