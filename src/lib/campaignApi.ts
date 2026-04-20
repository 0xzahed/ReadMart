const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

type ApiResponse<T> = {
  message?: string;
  status?: boolean;
  statusCode?: number;
  data?: T | null;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type CategorySummary = {
  id: string;
  title: string;
};

export type SubCategorySummary = {
  id: string;
  title: string;
  categoryId?: string;
  category?: CategorySummary;
};

export type CampaignProductSummary = {
  id: string;
  title: string;
  slug: string;
};

export type FlashSaleDiscountType = "PERCENT" | "TAKA";
export type FlashSaleCampaignStatus = "SCHEDULED" | "ACTIVE" | "EXPIRED";

export type FlashSaleCampaignSummary = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  discountType: FlashSaleDiscountType;
  discountValue: number;
  status: FlashSaleCampaignStatus;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FlashSaleCampaignWithClock = FlashSaleCampaignSummary & {
  serverTime: string;
  remainingSeconds: number;
};

export type FlashSaleCampaignDetail = FlashSaleCampaignSummary & {
  products: Array<{
    id: string;
    productId: string;
    createdAt: string;
    product: CampaignProductSummary & {
      stock?: boolean;
      availability?: boolean;
      isFreeDelivery?: boolean;
    };
  }>;
};

export type FlashSaleProductVariant = {
  id: string;
  actualPrice: number;
  discountedPrice: number;
  color: string;
  size: string;
  imageUrl: string;
  flashSalePrice: number;
};

export type FlashSaleActiveProduct = {
  id: string;
  title: string;
  slug: string;
  stock: boolean;
  availability: boolean;
  videoUrl: string | null;
  category: CategorySummary;
  subCategory: CategorySummary;
  variants: FlashSaleProductVariant[];
};

export type FlashSaleCampaignListResponse = {
  meta: PaginatedMeta;
  campaigns: FlashSaleCampaignSummary[];
};

export type ActiveFlashSaleProductsResponse = {
  campaign: FlashSaleCampaignWithClock | null;
  meta: PaginatedMeta;
  products: FlashSaleActiveProduct[];
};

export type FreeDeliveryCampaignSummary = {
  id: string;
  title: string;
  isActive: boolean;
  sourceCounts: {
    categories: number;
    subCategories: number;
    products: number;
    excludedProducts: number;
  };
  freeProductCount: number;
  createdAt: string;
  updatedAt: string;
};

export type FreeDeliveryPublicProduct = {
  id: string;
  title: string;
  slug: string;
  stock: boolean;
  availability: boolean;
  isFreeDelivery: boolean;
  category: CategorySummary;
  subCategory: CategorySummary;
  firstVariant: {
    actualPrice: string;
    discountedPrice: string;
    color: string;
    size: string;
    imageUrl: string;
  } | null;
};

export type FreeDeliveryPublicResponse = {
  campaign: FreeDeliveryCampaignSummary;
  meta: PaginatedMeta;
  products: FreeDeliveryPublicProduct[];
};

export type FreeDeliveryCategorySource = {
  id: string;
  categoryId: string;
  createdAt: string;
  category: CategorySummary;
};

export type FreeDeliverySubCategorySource = {
  id: string;
  subCategoryId: string;
  createdAt: string;
  subCategory: SubCategorySummary;
};

export type FreeDeliveryProductSource = {
  id: string;
  productId: string;
  createdAt: string;
  product: CampaignProductSummary & {
    isFreeDelivery?: boolean;
    category: CategorySummary;
    subCategory: CategorySummary;
  };
};

export type FreeDeliveryExcludedProductSource = {
  id: string;
  productId: string;
  createdAt: string;
  product: CampaignProductSummary & {
    category: CategorySummary;
    subCategory: CategorySummary;
  };
};

export type FreeDeliveryAdminResponse = FreeDeliveryCampaignSummary & {
  sources: {
    categories: FreeDeliveryCategorySource[];
    subCategories: FreeDeliverySubCategorySource[];
    products: FreeDeliveryProductSource[];
    excludedProducts: FreeDeliveryExcludedProductSource[];
  };
};

const resolveErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = (await response.json()) as ApiResponse<unknown>;
    return payload?.message || fallback;
  } catch {
    return fallback;
  }
};

const authHeaders = (accessToken?: string): Record<string, string> => {
  if (!accessToken) return {};
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};

const requestJson = async <T>(
  path: string,
  init: RequestInit,
  fallbackErrorMessage: string,
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is missing in frontend env.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.status) {
    if (!payload) {
      throw new Error(await resolveErrorMessage(response, fallbackErrorMessage));
    }

    throw new Error(payload?.message || fallbackErrorMessage);
  }

  return (payload.data ?? null) as T;
};

export const buildAssetUrl = (mediaUrl: string | null | undefined) => {
  if (!mediaUrl) return "";
  if (/^https?:\/\//i.test(mediaUrl)) return mediaUrl;

  if (!API_BASE_URL) {
    return mediaUrl;
  }

  try {
    const base = new URL(API_BASE_URL);
    return `${base.protocol}//${base.host}${mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`}`;
  } catch {
    return mediaUrl;
  }
};

export const getCampaignApiBaseUrl = () => API_BASE_URL;

export const fetchFlashSaleCampaignList = async (
  params: { page?: number; limit?: number },
  accessToken: string,
) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("limit", String(params.limit ?? 10));

  return requestJson<FlashSaleCampaignListResponse>(
    `/flash-sales?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(accessToken),
      },
      cache: "no-store",
    },
    "Failed to fetch flash sale campaigns.",
  );
};

export const fetchFlashSaleCampaignById = async (campaignId: string, accessToken: string) => {
  return requestJson<FlashSaleCampaignDetail>(
    `/flash-sales/${campaignId}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(accessToken),
      },
      cache: "no-store",
    },
    "Failed to fetch flash sale campaign.",
  );
};

export const createFlashSaleCampaign = async (
  body: {
    title: string;
    startAt: string;
    endAt: string;
    discountType: FlashSaleDiscountType;
    discountValue: number;
    productIds: string[];
  },
  accessToken: string,
) => {
  return requestJson<FlashSaleCampaignDetail>(
    "/flash-sales",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to create flash sale campaign.",
  );
};

export const updateFlashSaleCampaignTime = async (
  campaignId: string,
  body: {
    startAt?: string;
    endAt?: string;
  },
  accessToken: string,
) => {
  return requestJson<FlashSaleCampaignSummary>(
    `/flash-sales/${campaignId}/time`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update flash sale campaign time.",
  );
};

export const updateFlashSaleCampaignProducts = async (
  campaignId: string,
  body: {
    addProductIds?: string[];
    removeProductIds?: string[];
  },
  accessToken: string,
) => {
  return requestJson<FlashSaleCampaignDetail>(
    `/flash-sales/${campaignId}/products`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update flash sale campaign products.",
  );
};

export const deleteFlashSaleCampaign = async (campaignId: string, accessToken: string) => {
  return requestJson<null>(
    `/flash-sales/${campaignId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeaders(accessToken),
      },
    },
    "Failed to delete flash sale campaign.",
  );
};

export const fetchActiveFlashSaleCampaign = async () => {
  return requestJson<FlashSaleCampaignWithClock | null>(
    "/flash-sales/active",
    {
      method: "GET",
      cache: "no-store",
    },
    "Failed to fetch active flash sale.",
  );
};

export const fetchActiveFlashSaleProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("limit", String(params?.limit ?? 10));

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params?.categoryId?.trim()) {
    searchParams.set("categoryId", params.categoryId.trim());
  }

  return requestJson<ActiveFlashSaleProductsResponse>(
    `/flash-sales/active/products?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
    "Failed to fetch active flash sale products.",
  );
};

export const fetchFreeDeliveryPublic = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  subCategoryId?: string;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("limit", String(params?.limit ?? 10));

  if (params?.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }

  if (params?.categoryId?.trim()) {
    searchParams.set("categoryId", params.categoryId.trim());
  }

  if (params?.subCategoryId?.trim()) {
    searchParams.set("subCategoryId", params.subCategoryId.trim());
  }

  return requestJson<FreeDeliveryPublicResponse>(
    `/free-delivery?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
    "Failed to fetch free delivery data.",
  );
};

export const fetchFreeDeliveryAdmin = async (accessToken: string) => {
  return requestJson<FreeDeliveryAdminResponse>(
    "/free-delivery/admin",
    {
      method: "GET",
      headers: {
        ...authHeaders(accessToken),
      },
      cache: "no-store",
    },
    "Failed to fetch free delivery admin data.",
  );
};

export const updateFreeDeliveryCampaign = async (
  body: {
    title?: string;
    isActive?: boolean;
  },
  accessToken: string,
) => {
  return requestJson<FreeDeliveryCampaignSummary>(
    "/free-delivery/campaign",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update free delivery campaign.",
  );
};

export const updateFreeDeliveryCategories = async (
  body: {
    addCategoryIds?: string[];
    removeCategoryIds?: string[];
  },
  accessToken: string,
) => {
  return requestJson<FreeDeliveryAdminResponse>(
    "/free-delivery/categories",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update free delivery categories.",
  );
};

export const updateFreeDeliverySubCategories = async (
  body: {
    addSubCategoryIds?: string[];
    removeSubCategoryIds?: string[];
  },
  accessToken: string,
) => {
  return requestJson<FreeDeliveryAdminResponse>(
    "/free-delivery/sub-categories",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update free delivery subcategories.",
  );
};

export const updateFreeDeliveryProducts = async (
  body: {
    addProductIds?: string[];
    removeProductIds?: string[];
  },
  accessToken: string,
) => {
  return requestJson<FreeDeliveryAdminResponse>(
    "/free-delivery/products",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(accessToken),
      },
      body: JSON.stringify(body),
    },
    "Failed to update free delivery products.",
  );
};
