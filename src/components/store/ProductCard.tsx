"use client";

import { Link } from "react-router-dom";
import Image from "next/image";
import { Product } from "@/contexts/StoreContext";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-secondary ${compact ? "aspect-4/5" : "aspect-4/5"}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-contain transition-transform duration-300 group-hover:scale-105 ${compact ? "p-2" : "p-3 lg:p-4"}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          
          {/* Discount Badge - Top Left */}
          {product.discountPercent > 0 && (
            <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
              -{product.discountPercent}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-3 lg:p-4"}`}>
          {/* Product Name */}
          <h3 className={`line-clamp-2 text-foreground font-medium ${
            compact ? "text-xs" : "text-sm"
          }`}>
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-auto flex items-center gap-2 whitespace-nowrap">
            {/* Current Price - Left, Black, Bold */}
            <span className={`font-bold text-price-original ${
              compact ? "text-sm" : "text-base lg:text-lg"
            }`}>
              ${product.price.toFixed(2)}
            </span>

            {/* Original Price - Crossed out, Gray */}
            {product.originalPrice > product.price && (
              <div className="flex items-center gap-1">
                <span className="text-price-discounted text-xs line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
