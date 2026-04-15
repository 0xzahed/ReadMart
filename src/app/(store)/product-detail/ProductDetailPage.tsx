"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Minus,
  Plus,
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

  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [showAllColors, setShowAllColors] = useState(false);
  const [showShare, setShowShare] = useState(false);

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

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedColor);
    toast.success("Add successfully");
  };

  const handleBuyNow = () => {
    navigate(`/buy/${product.id}?qty=${quantity}&color=${encodeURIComponent(selectedColor)}`);
  };

  const handleWhatsAppShare = () => {
    const productLink = `${window.location.origin}/product/${product.id}`;
    const text = `Hi, I want to buy this product:\n${product.name}\nPrice: $${product.price.toFixed(2)}\nLink: ${productLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const visibleColors = showAllColors ? product.colors : product.colors.slice(0, 4);
  const hasMoreColors = product.colors.length > 4;
  const colorPaletteByName: Record<string, string> = {
    black: "#3f3f46",
    white: "#e5e7eb",
    silver: "#c9ced6",
    gray: "#9ca3af",
    grey: "#9ca3af",
    blue: "#7aa9ff",
    purple: "#b7a8ff",
    violet: "#a78bfa",
    gold: "#d4b06a",
    yellow: "#facc15",
    desert: "#d4c9c8",
    natural: "#d8d6d0",
    titanium: "#b7b4b4",
    starlight: "#efe3c8",
  };
  const getColorCircle = (colorName: string) => {
    const lowered = colorName.toLowerCase();
    const matchedKey = Object.keys(colorPaletteByName).find((key) => lowered.includes(key));
    return matchedKey ? colorPaletteByName[matchedKey] : "#d1d5db";
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

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto flex w-full max-w-330 items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowShare(!showShare)}
            className="p-2 text-foreground"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Share Dropdown */}
      {showShare && (
        <div className="absolute top-16 right-4 bg-card rounded-lg shadow-lg border border-border p-2 z-50">
          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-2 hover:bg-secondary rounded text-sm w-full text-left"
          >
            Share on WhatsApp
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-330 lg:px-8">
        <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-8 lg:py-8">
          <div>
            {/* Product Images */}
            <div className="relative aspect-square bg-secondary lg:rounded-2xl lg:overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto lg:px-0">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="px-4 py-4 lg:px-0 lg:py-0">
            {/* Product Name */}
            <h1 className="text-xl font-bold text-foreground mb-3 lg:text-3xl">{product.name}</h1>
            {product.discountPercent > 0 ? (
              <div className="mb-3">
                <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  {product.discountPercent}% OFF
                </span>
              </div>
            ) : null}

            {/* Price + Quantity Section */}
            <div className="mb-4 flex items-center justify-between gap-3 lg:mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-price-original lg:text-3xl">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-price-discounted line-through lg:text-lg">
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
            {product.brand ? (
              <p className="mb-4 text-sm font-medium lg:mb-6">
                <span className="text-muted-foreground">By </span>
                <span className="text-foreground">{product.brand}</span>
              </p>
            ) : null}

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="grid grid-cols-2 gap-2">
                {visibleColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`flex w-full items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "border-primary bg-primary/5 text-muted-foreground"
                        : "border-border bg-secondary/35 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-border/70"
                      style={{ backgroundColor: getColorCircle(color) }}
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
                <div className="space-y-2 rounded-2xl border border-border/70 bg-card p-4">
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
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border py- lg:py-8">
          <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
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
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 md:pb-20">
        <div className="mx-auto w-full max-w-330 relative">
          <button
            onClick={handleWhatsAppShare}
            aria-label="Share on WhatsApp"
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
