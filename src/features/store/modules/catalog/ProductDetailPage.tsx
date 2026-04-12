"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/layout/ProductCard";

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
    // Show success notification
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
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

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto flex w-full max-w-330 items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowShare(!showShare)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
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
            {/* Brand Name (Optional) */}
            {product.brand && (
              <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
            )}

            {/* Product Name */}
            <h1 className="text-xl font-bold text-foreground mb-3 lg:text-3xl">{product.name}</h1>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <span className="text-2xl font-bold text-price-original lg:text-3xl">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-price-discounted line-through lg:text-lg">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center gap-3 bg-secondary rounded-lg p-1">
                <button
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-background rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {visibleColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
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
        <section className="border-t border-border py-6 lg:py-8">
          <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Related Products</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible">
            {relatedProducts.slice(0, 6).map((relatedProduct) => (
              <div key={relatedProduct.id} className="w-40 shrink-0 lg:w-auto lg:shrink">
                <ProductCard product={relatedProduct} compact />
              </div>
            ))}
          </div>
          </div>
        </section>
      )}

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 md:pb-20">
        <div className="mx-auto w-full max-w-330">
          <button
            onClick={handleWhatsAppShare}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1ea952]"
          >
            <SiWhatsapp className="h-5 w-5" />
            WhatsApp Product Link
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
