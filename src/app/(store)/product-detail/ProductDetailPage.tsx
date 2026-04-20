"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Minus,
  Plus,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MonitorSmartphone,
  Cpu,
  Camera,
  BatteryCharging,
  Wifi,
  Bluetooth,
  HardDrive,
  MemoryStick,
  ShieldCheck,
  Speaker,
  Zap,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";
import { toast } from "sonner";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();

  const product = useMemo(() => {
    if (!id) {
      return undefined;
    }

    const loweredId = id.toLowerCase();
    return products.find((p) => {
      if (p.id === id) {
        return true;
      }

      const slug = p.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return slug === loweredId;
    });
  }, [id, products]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [showAllColors, setShowAllColors] = useState(false);

  useEffect(() => {
    if (!product) return;

    const timeoutId = window.setTimeout(() => {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedColor(product.colors[0] || "");
      setShowAllColors(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link to="/" className="text-primary hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const activeSelectedColor =
    selectedColor && product.colors.includes(selectedColor)
      ? selectedColor
      : product.colors[0] || "";

  const handleAddToCart = () => {
    const activeColor = activeSelectedColor || undefined;
    addToCart(product.id, quantity, activeColor);
    toast.success("Add successfully");
  };

  const handleBuyNow = () => {
    const activeColor = activeSelectedColor;
    const colorQuery = activeColor ? `&color=${encodeURIComponent(activeColor)}` : "";
    navigate(`/buy/${product.id}?qty=${quantity}${colorQuery}`);
  };

  const handleShare = async () => {
    const productLink = `${window.location.origin}/product/${product.id}`;
    const shareText = `${product.name} - $${product.price.toFixed(2)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productLink,
        });
        return;
      } catch {
        // Fall back to WhatsApp when native share dialog is dismissed or unavailable.
      }
    }

    const text = `Hi, I want to buy this product:\n${product.name}\nPrice: $${product.price.toFixed(2)}\nLink: ${productLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const formatReviewCount = (value: number | undefined): string => {
    const count = typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return `${count}`;
  };

  const visibleColors = showAllColors ? product.colors : product.colors.slice(0, 4);
  const hasMoreColors = product.colors.length > 4;
  const hasRating = Number.isFinite(product.rating) && product.rating > 0;
  const hasReviews = typeof product.reviews === "number" && product.reviews > 0;
  const showProductMeta = Boolean(product.brand) || hasRating || hasReviews;
  const formattedRating = hasRating ? product.rating.toFixed(1) : null;
  const formattedReviews = hasReviews ? formatReviewCount(product.reviews) : null;
  const colorTokenFallbackMap: Record<string, string> = {
    desert: "#d4c9c8",
    natural: "#d8d6d0",
    titanium: "#b7b4b4",
    starlight: "#efe3c8",
  };

  const isBrowserColorValue = (value: string): boolean => {
    if (!value) return false;
    if (typeof window === "undefined" || typeof CSS === "undefined" || !CSS.supports) {
      return false;
    }
    return CSS.supports("color", value);
  };

  const normalizePotentialHexColor = (value: string): string | null => {
    const hexOnly = value.replace(/^#/, "");
    if (/^[0-9a-fA-F]{3}$/.test(hexOnly) || /^[0-9a-fA-F]{6}$/.test(hexOnly) || /^[0-9a-fA-F]{8}$/.test(hexOnly)) {
      return `#${hexOnly}`;
    }
    return null;
  };

  const resolveDynamicColor = (colorName: string): string => {
    const raw = (colorName || "").trim();
    if (!raw) return "#d1d5db";

    const directCandidates = [
      raw,
      raw.toLowerCase(),
      raw.replace(/\s+/g, ""),
      raw.toLowerCase().replace(/\s+/g, ""),
    ];

    const normalizedHex = normalizePotentialHexColor(raw);
    if (normalizedHex) {
      directCandidates.unshift(normalizedHex);
    }

    for (const candidate of directCandidates) {
      if (isBrowserColorValue(candidate)) {
        return candidate;
      }
    }

    const lowered = raw.toLowerCase();
    const splitTokens = lowered.split(/[\s,/|_-]+/).filter(Boolean);

    for (const token of splitTokens) {
      if (isBrowserColorValue(token)) {
        return token;
      }

      const fallbackTokenColor = colorTokenFallbackMap[token];
      if (fallbackTokenColor) {
        return fallbackTokenColor;
      }
    }

    return "#d1d5db";
  };

  const specIconMap = {
    display: MonitorSmartphone,
    cpu: Cpu,
    camera: Camera,
    battery: BatteryCharging,
    wifi: Wifi,
    bluetooth: Bluetooth,
    storage: HardDrive,
    memory: MemoryStick,
    shield: ShieldCheck,
    speaker: Speaker,
    zap: Zap,
  } as const;

  const specificationItems = product.specifications || [];
  const productImages = product.images.filter((image) => typeof image === "string" && image.trim().length > 0);
  const hasProductImages = productImages.length > 0;
  const activeImageIndex = hasProductImages
    ? Math.min(selectedImage, productImages.length - 1)
    : 0;
  const activeImage = hasProductImages ? productImages[activeImageIndex] : "";

  return (
    <div className="relative min-h-screen bg-secondary/25 pb-32 font-sans">
      {/* Top Navigation */}
      <div className="absolute inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-secondary/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-secondary/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px] lg:px-8">
        <div className="lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-10 lg:py-8">
          <div className="lg:sticky lg:top-24">
            {/* Product Images */}
            <div className="relative mx-auto w-[92%] aspect-4/5 bg-secondary lg:w-full lg:aspect-square lg:rounded-2xl lg:overflow-hidden">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto lg:px-0">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image src={image} alt="" fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="px-4 py-4 lg:px-0 lg:py-1">
            {/* Product Name */}
            <h1 className="mb-2 text-[1.85rem] font-semibold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[2.2rem] lg:text-[2.6rem]">
              {product.name}
            </h1>
            {product.discountPercent > 0 ? (
              <div className="mb-3">
                <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {product.discountPercent}% OFF
                </span>
              </div>
            ) : null}

            {showProductMeta ? (
              <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground sm:text-base lg:mb-5">
                {product.brand ? (
                  <>
                    <span>By</span>
                    <span className="font-medium text-[#2f73d9]">{product.brand}</span>
                  </>
                ) : null}

                {formattedRating ? (
                  <>
                    {product.brand ? <span className="px-1 text-muted-foreground/70">•</span> : null}
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span className="font-medium text-foreground">{formattedRating}</span>
                      {formattedReviews ? <span>({formattedReviews})</span> : null}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/70" />
                  </>
                ) : null}
              </div>
            ) : null}

            {/* Price + Quantity Section */}
            <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
              <div className="flex items-center gap-3">
                <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.01em] text-price-original sm:text-[1.9rem] lg:text-[2.2rem]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[1.25rem] font-normal leading-none text-price-discounted line-through sm:text-[1.35rem] lg:text-[1.9rem]">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="grid grid-cols-2 gap-2">
                {visibleColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`flex w-full items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      activeSelectedColor === color
                        ? "border-primary bg-primary/5 text-muted-foreground"
                        : "border-border bg-secondary/35 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-border/70"
                      style={{ backgroundColor: resolveDynamicColor(color) }}
                    />
                    {color}
                  </button>
                ))}
              </div>
              {hasMoreColors && !showAllColors && (
                <button
                  onClick={() => setShowAllColors(true)}
                  className="flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  See More
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}
              {showAllColors && (
                <button
                  onClick={() => setShowAllColors(false)}
                  className="flex items-center gap-1 mt-3 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Show Less
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}
            </div>

            {specificationItems.length > 0 ? (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-foreground">A Snapshot View</h3>
                <div className="space-y-2">
                  {specificationItems.map((item, index) => {
                    const Icon = specIconMap[(item.icon as keyof typeof specIconMap) || "display"] || MonitorSmartphone;
                    return (
                      <div key={`${item.label}-${index}`} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{item.label}:</span> {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            <div className="hidden lg:flex lg:items-center lg:gap-3">
              <button
                onClick={handleShare}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-colors hover:bg-[#1ea952]"
                aria-label="Share product"
              >
                <SiWhatsapp className="h-6 w-6" />
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 rounded-full border border-primary bg-background py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border py-6 lg:py-8">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-foreground">Related Products</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
              {relatedProducts.slice(0, 6).map((relatedProduct) => (
                <div key={relatedProduct.id} className="w-48 shrink-0 lg:w-auto lg:shrink">
                  <ProductCard product={relatedProduct} compact />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="relative mx-auto w-full max-w-[1280px]">
          <button
            onClick={handleShare}
            aria-label="Share product"
            className="absolute -top-24 right-0 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-colors hover:bg-[#1ea952]"
          >
            <SiWhatsapp className="h-8 w-8" />
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleBuyNow}
              className="flex-1 rounded-full border border-primary bg-background py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
