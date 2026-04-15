"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import sneaker1 from "@/assets/products/sneaker1.png";
import handbag1 from "@/assets/products/handbag1.png";
import headphones1 from "@/assets/products/headphones1.png";
import watch1 from "@/assets/products/watch1.png";
import dress1 from "@/assets/products/dress1.png";
import sofa1 from "@/assets/products/sofa1.png";

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

// Sample data
const sampleSliders: Slider[] = [
  {
    id: "1",
    image: sneaker1.src,
    title: "iPhone 16 Pro",
    subtitle: "Extraordinary Visual & Exceptional Power",
    buttonText: "Shop Now",
    buttonLink: "/product/1",
    isActive: true,
  },
  {
    id: "2",
    image: handbag1.src,
    title: "Galaxy S24 Ultra",
    subtitle: "Performance and style together",
    buttonText: "Shop Now",
    buttonLink: "/product/2",
    isActive: true,
  },
  {
    id: "3",
    image: headphones1.src,
    title: "Sony WH-1000XM5",
    subtitle: "Premium sound quality",
    buttonText: "Shop Now",
    buttonLink: "/product/3",
    isActive: true,
  },
  {
    id: "4",
    image: watch1.src,
    title: "MacBook Pro 16",
    subtitle: "Power for professionals",
    buttonText: "Shop Now",
    buttonLink: "/product/4",
    isActive: true,
  },
  {
    id: "5",
    image: dress1.src,
    title: "iPad Air M2",
    subtitle: "Lightweight and powerful",
    buttonText: "Shop Now",
    buttonLink: "/product/5",
    isActive: true,
  },
];

const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Mobile",
    image: sneaker1.src,
    link: "/categories/1",
    subcategories: ["Flagship", "Budget", "Accessories"],
    isActive: true,
  },
  {
    id: "2",
    name: "Headphone",
    image: headphones1.src,
    link: "/categories/2",
    subcategories: ["Wireless", "Gaming", "Studio"],
    isActive: true,
  },
  {
    id: "3",
    name: "Tablets",
    image: dress1.src,
    link: "/categories/3",
    subcategories: ["Android", "iPad", "Accessories"],
    isActive: true,
  },
  {
    id: "4",
    name: "Laptop",
    image: watch1.src,
    link: "/categories/4",
    subcategories: ["Ultrabook", "Gaming", "Workstation"],
    isActive: true,
  },
  {
    id: "5",
    name: "Speakers",
    image: handbag1.src,
    link: "/categories/5",
    subcategories: ["Bluetooth", "Home Theater", "Portable"],
    isActive: true,
  },
  {
    id: "6",
    name: "Smart Watch",
    image: sofa1.src,
    link: "/categories/6",
    subcategories: ["Fitness", "Luxury", "Kids"],
    isActive: true,
  },
];

const defaultSliderImagesById: Record<string, string> = {
  "1": sneaker1.src,
  "2": handbag1.src,
  "3": headphones1.src,
  "4": watch1.src,
  "5": dress1.src,
};

const defaultCategoryImagesById: Record<string, string> = {
  "1": sneaker1.src,
  "2": headphones1.src,
  "3": dress1.src,
  "4": watch1.src,
  "5": handbag1.src,
  "6": sofa1.src,
};

const defaultProductImagesById: Record<string, string[]> = {
  "1": [sneaker1.src],
  "2": [handbag1.src],
  "3": [headphones1.src],
  "4": [watch1.src],
  "5": [dress1.src],
  "6": [sofa1.src],
};

const isPlaceholderImage = (image: string) => {
  return (
    image.includes("placehold.co") ||
    image.includes("placeholder-product") ||
    image.includes("placeholder-cat") ||
    image.includes("placeholder-slider")
  );
};

const normalizeSlidersWithImages = (input: Slider[]): Slider[] => {
  return input.map((slider) => {
    const fallback = defaultSliderImagesById[slider.id] || sneaker1.src;
    const image = !slider.image || isPlaceholderImage(slider.image) ? fallback : slider.image;

    return {
      ...slider,
      image,
      buttonText: slider.buttonText || "Shop Now",
      buttonLink: slider.buttonLink || "/",
    };
  });
};

const normalizeCategoriesWithImages = (input: Category[]): Category[] => {
  return input.map((category) => {
    const fallback = defaultCategoryImagesById[category.id] || sneaker1.src;
    const image = !category.image || isPlaceholderImage(category.image) ? fallback : category.image;
    const normalizedSubcategories = Array.isArray(category.subcategories)
      ? category.subcategories
          .map((subcategory) => (typeof subcategory === "string" ? subcategory.trim() : ""))
          .filter(Boolean)
      : [];

    return {
      ...category,
      image,
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

    const fallbackImages = defaultProductImagesById[product.id];

    const normalizedSpecifications = Array.isArray(product.specifications)
      ? product.specifications
          .map((item) => ({
            label: (item?.label || "").trim(),
            value: (item?.value || "").trim(),
            icon: (item?.icon || "").trim() || undefined,
          }))
          .filter((item) => item.label && item.value)
      : [];

    if (!fallbackImages) {
      return { ...product, images: currentImages, specifications: normalizedSpecifications };
    }

    if (currentImages.length === 0 || currentImages.every(isPlaceholderImage)) {
      return { ...product, images: fallbackImages, specifications: normalizedSpecifications };
    }

    return { ...product, images: currentImages, specifications: normalizedSpecifications };
  });
};

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 16 Pro Max",
    price: 1399.99,
    originalPrice: 1499.99,
    images: defaultProductImagesById["1"],
    category: "1",
    subcategory: "Flagship",
    brand: "Apple",
    rating: 4.8,
    reviews: 234,
    description: "The ultimate iPhone experience with advanced camera system and A18 Pro chip.",
    colors: ["Desert Titanium", "Natural Titanium", "White Titanium", "Black Titanium"],
    specifications: [
      { label: "Display", value: "6.9-inch 4K Ultra HD XDR", icon: "display" },
      { label: "Chipset", value: "A18 Pro", icon: "cpu" },
      { label: "Camera", value: "48MP Pro camera system", icon: "camera" },
      { label: "Wireless Charging", value: "MagSafe supported", icon: "wifi" },
    ],
    barcode: "890100000001",
    inStock: true,
    isFlashDeal: true,
    discountPercent: 7,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    price: 1199.99,
    originalPrice: 1299.99,
    images: defaultProductImagesById["2"],
    category: "1",
    subcategory: "Flagship",
    brand: "Samsung",
    rating: 4.7,
    reviews: 189,
    description: "Premium Android smartphone with S Pen and AI features.",
    colors: ["Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"],
    barcode: "890100000002",
    inStock: true,
    isFlashDeal: true,
    discountPercent: 8,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    price: 349.99,
    originalPrice: 399.99,
    images: defaultProductImagesById["3"],
    category: "2",
    subcategory: "Wireless",
    brand: "Sony",
    rating: 4.9,
    reviews: 567,
    description: "Industry-leading noise cancellation with exceptional sound quality.",
    colors: ["Black", "Silver", "Midnight Blue"],
    barcode: "890100000003",
    inStock: true,
    isFlashDeal: true,
    discountPercent: 12,
  },
  {
    id: "4",
    name: "MacBook Pro 16",
    price: 2499.99,
    originalPrice: 2699.99,
    images: defaultProductImagesById["4"],
    category: "4",
    subcategory: "Workstation",
    brand: "Apple",
    rating: 4.9,
    reviews: 342,
    description: "Powerful laptop with M3 Pro chip and stunning Retina display.",
    colors: ["Space Gray", "Silver"],
    barcode: "890100000004",
    inStock: true,
    isFlashDeal: false,
    discountPercent: 7,
  },
  {
    id: "5",
    name: "iPad Air M2",
    price: 799.99,
    originalPrice: 899.99,
    images: defaultProductImagesById["5"],
    category: "3",
    subcategory: "iPad",
    brand: "Apple",
    rating: 4.8,
    reviews: 156,
    description: "Versatile tablet with M2 chip and Apple Pencil Pro support.",
    colors: ["Space Gray", "Starlight", "Purple", "Blue"],
    barcode: "890100000005",
    inStock: true,
    isFlashDeal: true,
    discountPercent: 11,
  },
  {
    id: "6",
    name: "AirPods Pro 2",
    price: 249.99,
    originalPrice: 279.99,
    images: defaultProductImagesById["6"],
    category: "2",
    subcategory: "Wireless",
    brand: "Apple",
    rating: 4.7,
    reviews: 892,
    description: "Active noise cancellation with adaptive audio.",
    colors: ["White"],
    barcode: "890100000006",
    inStock: true,
    isFlashDeal: true,
    discountPercent: 10,
  },
];

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
  // Load from localStorage or use samples
  const [sliders, setSliders] = useState<Slider[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_sliders");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return normalizeSlidersWithImages(parsed as Slider[]);
          }
        } catch {
          // Fall back to sample data when saved data is malformed.
        }
      }
    }
    return normalizeSlidersWithImages(sampleSliders);
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_categories");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return normalizeCategoriesWithImages(parsed as Category[]);
          }
        } catch {
          // Fall back to sample data when saved data is malformed.
        }
      }
    }
    return normalizeCategoriesWithImages(sampleCategories);
  });

  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("readmart_products");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return normalizeProductsWithImages(parsed as Product[]);
          }
        } catch {
          // Fall back to sample data when saved data is malformed.
        }
      }
    }
    return normalizeProductsWithImages(sampleProducts);
  });

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

  // Save to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_sliders", JSON.stringify(sliders));
    }
  }, [sliders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_categories", JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("readmart_products", JSON.stringify(products));
    }
  }, [products]);

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
      image: slider.image || sneaker1.src,
    };
    setSliders((prev) => [...prev, newSlider]);
  };

  const updateSlider = (id: string, slider: Partial<Slider>) => {
    setSliders((prev) => prev.map((s) => (s.id === id ? { ...s, ...slider } : s)));
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
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    const sanitizedSubcategories = Array.isArray(category.subcategories)
      ? category.subcategories.map((subcategory) => subcategory.trim()).filter(Boolean)
      : undefined;

    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...category,
              link: category.link || c.link || `/categories/${id}`,
              subcategories: sanitizedSubcategories ?? c.subcategories ?? [],
            }
          : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Product functions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: generateId() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)));
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
