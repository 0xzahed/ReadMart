"use client";

import React, { createContext, useCallback, useContext, useState, ReactNode, useEffect } from "react";

// Types
export interface Slider {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  link?: string;
  subcategories?: string[];
  subCategoryImageMap?: Record<string, string>;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  rating: number;
  reviews?: number;
  description: string;
  colors: string[];
  specifications?: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  barcode?: string;
  inStock: boolean;
  isFlashDeal: boolean;
  discountPercent: number;
}

export interface FlashDeal {
  id: string;
  backgroundImage?: string;
  endTime: string;
  isActive: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface Order {
  id: string;
  trackingToken?: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  status: "pending" | "confirmed" | "cancelled" | "delivered";
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  promoCode?: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}

interface StoreContextType {
  refreshStorefrontData: (options?: { silent?: boolean }) => Promise<void>;

  // Sliders
  sliders: Slider[];
  addSlider: (slider: Omit<Slider, "id">) => void;
  updateSlider: (id: string, slider: Partial<Slider>) => void;
  deleteSlider: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Flash Deals
  flashDeal: FlashDeal | null;
  updateFlashDeal: (flashDeal: FlashDeal) => void;

  // Promo Codes
  promoCodes: PromoCode[];
  addPromoCode: (promo: Omit<PromoCode, "id">) => void;
  updatePromoCode: (id: string, promo: Partial<PromoCode>) => void;
  deletePromoCode: (id: string) => void;
  applyPromoCode: (code: string) => number;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  updateCartItemColor: (productId: string, color: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "createdAt">) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "createdAt">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;

  // Delivery
  deliveryCharge: number;
  setDeliveryCharge: (charge: number) => void;
  freeDeliveryThreshold: number;
  setFreeDeliveryThreshold: (threshold: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateTrackingToken = () => `RM-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

type ApiResponse<T> = {
  message?: string;
  status?: boolean;
  statusCode?: number;
  data?: T | null;
};

type BannerApiItem = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
};

type CategoryApiItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type CategoryListApiData = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  categories: CategoryApiItem[];
};

type SubCategoryApiItem = {
  id: string;
  categoryId: string;
  title: string;
  imageUrl?: string;
};

type SubCategoryListApiData = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  subCategories: SubCategoryApiItem[];
};

type ProductApiVariant = {
  actualPrice: number | string;
  discountedPrice: number | string;
  color: string;
  imageUrl: string;
  size?: string;
};

type ProductApiItem = {
  id: string;
  title: string;
  descriptionHtml?: string;
  weight?: string;
  material?: string;
  stock: boolean;
  availability: boolean;
  category: {
    id: string;
    title: string;
  };
  subCategory: {
    id: string;
    title: string;
  };
  variants?: ProductApiVariant[];
  firstVariant?: ProductApiVariant | null;
};

type ProductListApiData = {
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
  products: ProductApiItem[];
};

const toAbsoluteAssetUrl = (mediaUrl: string | null | undefined): string => {
  if (!mediaUrl) return "";
  if (/^(https?:)?\/\//i.test(mediaUrl)) return mediaUrl;
  if (mediaUrl.startsWith("data:") || mediaUrl.startsWith("blob:")) return mediaUrl;

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

const ensureUploadFolderPath = (
  mediaUrl: string | null | undefined,
  folderName: string,
): string => {
  if (!mediaUrl) return "";
  if (/^(https?:)?\/\//i.test(mediaUrl)) return mediaUrl;
  if (mediaUrl.startsWith("data:") || mediaUrl.startsWith("blob:")) return mediaUrl;

  const normalizedPath = mediaUrl.startsWith("/") ? mediaUrl : `/${mediaUrl}`;
  const uploadPrefix = "/upload/";

  if (!normalizedPath.startsWith(uploadPrefix)) {
    return normalizedPath;
  }

  const remainder = normalizedPath.slice(uploadPrefix.length);

  if (!remainder || remainder.includes("/")) {
    return normalizedPath;
  }

  return `${uploadPrefix}${folderName}/${remainder}`;
};

const toNumber = (value: number | string | undefined, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

const htmlToText = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const calculateDiscountPercent = (actualPrice: number, discountedPrice: number): number => {
  if (actualPrice <= 0 || discountedPrice >= actualPrice) {
    return 0;
  }

  return Math.round(((actualPrice - discountedPrice) / actualPrice) * 100);
};

const mapBannerToSlider = (banner: BannerApiItem): Slider => ({
  id: banner.id,
  image: toAbsoluteAssetUrl(ensureUploadFolderPath(banner.imageUrl, "banners")),
  title: banner.title,
  subtitle: "",
  buttonText: "Shop Now",
  buttonLink: banner.url || "/",
  isActive: true,
});

const mapCategoryToStoreCategory = (
  category: CategoryApiItem,
  subcategoryTitles: string[],
  subCategoryImageMap: Record<string, string>,
): Category => ({
  id: category.id,
  name: category.title,
  image: toAbsoluteAssetUrl(ensureUploadFolderPath(category.imageUrl, "categories")),
  link: `/categories/${category.id}`,
  subcategories: subcategoryTitles,
  subCategoryImageMap,
  isActive: true,
});

const mapProductToStoreProduct = (product: ProductApiItem): Product => {
  const variantsFromApi = Array.isArray(product.variants) ? product.variants : [];
  const fallbackFirstVariant = product.firstVariant ? [product.firstVariant] : [];
  const variants = variantsFromApi.length > 0 ? variantsFromApi : fallbackFirstVariant;

  const normalizedVariants = variants.map((variant) => ({
    actualPrice: toNumber(variant.actualPrice),
    discountedPrice: toNumber(variant.discountedPrice),
    color: (variant.color || "").trim(),
    imageUrl: toAbsoluteAssetUrl(ensureUploadFolderPath(variant.imageUrl, "products/images")),
  }));

  const firstVariant = normalizedVariants[0];
  const actualPrice = firstVariant?.actualPrice ?? 0;
  const discountedPrice = firstVariant?.discountedPrice ?? actualPrice;
  const price = discountedPrice > 0 ? discountedPrice : actualPrice;

  const images = normalizedVariants
    .map((variant) => variant.imageUrl)
    .filter((imageUrl) => imageUrl.length > 0);

  const colors = Array.from(
    new Set(
      normalizedVariants
        .map((variant) => variant.color)
        .filter((color) => color.length > 0),
    ),
  );

  const descriptionText = htmlToText(product.descriptionHtml);
  const details: Product["specifications"] = [
    product.weight ? { label: "Weight", value: product.weight } : null,
    product.material ? { label: "Material", value: product.material } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return {
    id: product.id,
    name: product.title,
    price,
    originalPrice: actualPrice > 0 ? actualPrice : price,
    images,
    category: product.category?.id || "",
    subcategory: product.subCategory?.title || "",
    brand: undefined,
    rating: 0,
    reviews: 0,
    description: descriptionText || "No description available.",
    colors,
    specifications: details,
    barcode: undefined,
    inStock: Boolean(product.stock && product.availability),
    isFlashDeal: false,
    discountPercent: calculateDiscountPercent(actualPrice, price),
  };
};

const fetchApiData = async <T,>(path: string): Promise<T | null> => {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !payload?.status) {
    throw new Error(payload?.message || `Failed to fetch ${path}`);
  }

  return (payload.data ?? null) as T | null;
};

const fetchAllPaginatedData = async <TItem, TPayload extends { meta?: { totalPage?: number } }>(
  fetchPage: (page: number, limit: number) => Promise<TPayload | null>,
  pickItems: (payload: TPayload | null) => TItem[],
): Promise<TItem[]> => {
  const limit = 100;
  let page = 1;
  let totalPage = 1;
  const items: TItem[] = [];

  while (page <= totalPage) {
    const payload = await fetchPage(page, limit);
    const pageItems = pickItems(payload);

    if (pageItems.length > 0) {
      items.push(...pageItems);
    }

    const resolvedTotalPage = payload?.meta?.totalPage;
    totalPage = typeof resolvedTotalPage === "number" && resolvedTotalPage > 0 ? resolvedTotalPage : 1;

    if (page >= totalPage) {
      break;
    }

    page += 1;
  }

  return items;
};

const buildSubCategoryTitlesByCategoryId = (
  subCategories: SubCategoryApiItem[],
): Map<string, string[]> => {
  const groupedSubCategories = new Map<string, string[]>();

  for (const subCategory of subCategories) {
    const normalizedTitle = subCategory.title?.trim();
    if (!normalizedTitle) {
      continue;
    }

    const existingItems = groupedSubCategories.get(subCategory.categoryId) ?? [];
    if (existingItems.includes(normalizedTitle)) {
      continue;
    }

    groupedSubCategories.set(subCategory.categoryId, [...existingItems, normalizedTitle]);
  }

  return groupedSubCategories;
};

const buildSubCategoryImageMapByCategoryId = (
  subCategories: SubCategoryApiItem[],
): Map<string, Record<string, string>> => {
  const groupedImageMaps = new Map<string, Record<string, string>>();

  for (const subCategory of subCategories) {
    const normalizedTitle = subCategory.title?.trim();
    if (!normalizedTitle) {
      continue;
    }

    const absoluteImageUrl = toAbsoluteAssetUrl(
      ensureUploadFolderPath(subCategory.imageUrl, "subCategories"),
    );
    if (!absoluteImageUrl) {
      continue;
    }

    const previousImageMap = groupedImageMaps.get(subCategory.categoryId) ?? {};
    groupedImageMaps.set(subCategory.categoryId, {
      ...previousImageMap,
      [normalizedTitle]: absoluteImageUrl,
    });
  }

  return groupedImageMaps;
};

// Sample data
const sampleSliders: Slider[] = [];

const sampleCategories: Category[] = [];

const normalizeSlidersWithImages = (input: Slider[]): Slider[] => {
  return input.map((slider) => ({
    ...slider,
    image: slider.image || "",
    buttonText: slider.buttonText || "Shop Now",
    buttonLink: slider.buttonLink || "/",
  }));
};

const normalizeCategoriesWithImages = (input: Category[]): Category[] => {
  return input.map((category) => {
    const normalizedSubcategories = Array.isArray(category.subcategories)
      ? category.subcategories
          .map((subcategory) => (typeof subcategory === "string" ? subcategory.trim() : ""))
          .filter(Boolean)
      : [];

    return {
      ...category,
      image: category.image || "",
      link: category.link || `/categories/${category.id}`,
      subcategories: normalizedSubcategories,
    };
  });
};

const normalizeProductsWithImages = (products: Product[]): Product[] => {
  return products.map((product) => {
    const currentImages = Array.isArray(product.images)
      ? product.images.filter((image) => typeof image === "string" && image.trim().length > 0)
      : [];

    const normalizedSpecifications = Array.isArray(product.specifications)
      ? product.specifications
          .map((item) => ({
            label: (item?.label || "").trim(),
            value: (item?.value || "").trim(),
            icon: (item?.icon || "").trim() || undefined,
          }))
          .filter((item) => item.label && item.value)
      : [];

    return { ...product, images: currentImages, specifications: normalizedSpecifications };
  });
};

const sampleProducts: Product[] = [];

const sampleFlashDeal: FlashDeal = {
  id: "1",
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
};

const samplePromoCodes: PromoCode[] = [
  { id: "1", code: "SAVE10", discountPercent: 10, isActive: true },
  { id: "2", code: "WELCOME20", discountPercent: 20, isActive: true, expiryDate: "2025-12-31" },
];

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [sliders, setSliders] = useState<Slider[]>(sampleSliders);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const [flashDeal, setFlashDeal] = useState<FlashDeal | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_flashDeal");
      return saved ? JSON.parse(saved) : sampleFlashDeal;
    }
    return sampleFlashDeal;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_promoCodes");
      return saved ? JSON.parse(saved) : samplePromoCodes;
    }
    return samplePromoCodes;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_cart");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_orders");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_notifications");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [deliveryCharge, setDeliveryCharge] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_deliveryCharge");
      return saved ? JSON.parse(saved) : 50;
    }
    return 50;
  });

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_freeDeliveryThreshold");
      return saved ? JSON.parse(saved) : 500;
    }
    return 500;
  });

  const refreshStorefrontData = useCallback(async () => {
    if (!API_BASE_URL) {
      setSliders([]);
      setCategories([]);
      setProducts([]);
      return;
    }

    try {
      const [bannerData, allCategories, allSubCategories, allProducts] = await Promise.all([
        fetchApiData<BannerApiItem[]>("/banners"),
        fetchAllPaginatedData<CategoryApiItem, CategoryListApiData>(
          (page, limit) => fetchApiData<CategoryListApiData>(`/categories?page=${page}&limit=${limit}`),
          (payload) => (Array.isArray(payload?.categories) ? payload.categories : []),
        ),
        fetchAllPaginatedData<SubCategoryApiItem, SubCategoryListApiData>(
          (page, limit) => fetchApiData<SubCategoryListApiData>(`/subcategories?page=${page}&limit=${limit}`),
          (payload) => (Array.isArray(payload?.subCategories) ? payload.subCategories : []),
        ),
        fetchAllPaginatedData<ProductApiItem, ProductListApiData>(
          (page, limit) => fetchApiData<ProductListApiData>(`/products?page=${page}&limit=${limit}`),
          (payload) => (Array.isArray(payload?.products) ? payload.products : []),
        ),
      ]);

      const subCategoryTitlesByCategoryId = buildSubCategoryTitlesByCategoryId(allSubCategories);
      const subCategoryImageMapByCategoryId = buildSubCategoryImageMapByCategoryId(allSubCategories);
      const mappedSliders = Array.isArray(bannerData) ? bannerData.map(mapBannerToSlider) : [];
      const mappedCategories = allCategories.map((category) =>
        mapCategoryToStoreCategory(
          category,
          subCategoryTitlesByCategoryId.get(category.id) ?? [],
          subCategoryImageMapByCategoryId.get(category.id) ?? {},
        ),
      );
      const mappedProducts = allProducts.map(mapProductToStoreProduct);

      setSliders(mappedSliders);
      setCategories(mappedCategories);
      setProducts(mappedProducts);
    } catch {
      setSliders([]);
      setCategories([]);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshStorefrontData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [refreshStorefrontData]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorefrontRefresh = () => {
      void refreshStorefrontData();
    };

    window.addEventListener("readmart:storefront-updated", handleStorefrontRefresh);

    return () => {
      window.removeEventListener("readmart:storefront-updated", handleStorefrontRefresh);
    };
  }, [refreshStorefrontData]);

  // Save to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_flashDeal", JSON.stringify(flashDeal));
    }
  }, [flashDeal]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_promoCodes", JSON.stringify(promoCodes));
    }
  }, [promoCodes]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_orders", JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_deliveryCharge", JSON.stringify(deliveryCharge));
    }
  }, [deliveryCharge]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_freeDeliveryThreshold", JSON.stringify(freeDeliveryThreshold));
    }
  }, [freeDeliveryThreshold]);

  // Slider functions
  const addSlider = (slider: Omit<Slider, "id">) => {
    const newSlider = {
      ...slider,
      id: generateId(),
      buttonText: slider.buttonText || "Shop Now",
      image: slider.image || "",
    };
    setSliders((prev) => normalizeSlidersWithImages([...prev, newSlider]));
  };

  const updateSlider = (id: string, slider: Partial<Slider>) => {
    setSliders((prev) => normalizeSlidersWithImages(prev.map((s) => (s.id === id ? { ...s, ...slider } : s))));
  };

  const deleteSlider = (id: string) => {
    setSliders((prev) => prev.filter((s) => s.id !== id));
  };

  // Category functions
  const addCategory = (category: Omit<Category, "id">) => {
    const id = generateId();
    const sanitizedSubcategories = Array.isArray(category.subcategories)
      ? category.subcategories.map((subcategory) => subcategory.trim()).filter(Boolean)
      : [];
    const newCategory = {
      ...category,
      id,
      link: category.link || `/categories/${id}`,
      subcategories: sanitizedSubcategories,
    };
    setCategories((prev) => normalizeCategoriesWithImages([...prev, newCategory]));
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    const sanitizedSubcategories = Array.isArray(category.subcategories)
      ? category.subcategories.map((subcategory) => subcategory.trim()).filter(Boolean)
      : undefined;

    setCategories((prev) =>
      normalizeCategoriesWithImages(
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...category,
                link: category.link || c.link || `/categories/${id}`,
                subcategories: sanitizedSubcategories ?? c.subcategories ?? [],
              }
            : c
        ),
      ),
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Product functions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: generateId() };
    setProducts((prev) => normalizeProductsWithImages([...prev, newProduct]));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => normalizeProductsWithImages(prev.map((p) => (p.id === id ? { ...p, ...product } : p))));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Flash Deal functions
  const updateFlashDeal = (newFlashDeal: FlashDeal) => {
    setFlashDeal(newFlashDeal);
  };

  // Promo Code functions
  const addPromoCode = (promo: Omit<PromoCode, "id">) => {
    const newPromo = { ...promo, id: generateId() };
    setPromoCodes((prev) => [...prev, newPromo]);
  };

  const updatePromoCode = (id: string, promo: Partial<PromoCode>) => {
    setPromoCodes((prev) => prev.map((p) => (p.id === id ? { ...p, ...promo } : p)));
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  const applyPromoCode = (code: string): number => {
    const promo = promoCodes.find(
      (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive
    );
    if (!promo) return 0;
    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) return 0;
    return promo.discountPercent;
  };

  // Cart functions
  const addToCart = (productId: string, quantity = 1, color?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, selectedColor: color || item.selectedColor }
            : item
        );
      }
      return [...prev, { productId, quantity, selectedColor: color }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const updateCartItemColor = (productId: string, color: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, selectedColor: color } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Order functions
  const placeOrder = (order: Omit<Order, "id" | "createdAt">): Order => {
    const newOrder = {
      ...order,
      id: generateId(),
      trackingToken: order.trackingToken || generateTrackingToken(),
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // Notification functions
  const addNotification = (notification: Omit<Notification, "id" | "isRead" | "createdAt">) => {
    const newNotification = {
      ...notification,
      id: generateId(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <StoreContext.Provider
      value={{
        refreshStorefrontData,
        sliders,
        addSlider,
        updateSlider,
        deleteSlider,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        flashDeal,
        updateFlashDeal,
        promoCodes,
        addPromoCode,
        updatePromoCode,
        deletePromoCode,
        applyPromoCode,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        updateCartItemColor,
        clearCart,
        getCartTotal,
        getCartCount,
        orders,
        placeOrder,
        updateOrderStatus,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
        deliveryCharge,
        setDeliveryCharge,
        freeDeliveryThreshold,
        setFreeDeliveryThreshold,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
