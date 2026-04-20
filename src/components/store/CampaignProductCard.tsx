"use client";

import Image from "next/image";
import { Link } from "react-router-dom";

type CampaignProductCardProps = {
  title: string;
  imageUrl?: string | null;
  price: number;
  previousPrice?: number | null;
  badge?: string;
  compact?: boolean;
  to?: string;
};

export function CampaignProductCard({
  title,
  imageUrl,
  price,
  previousPrice,
  badge,
  compact = false,
  to,
}: CampaignProductCardProps) {
  const cardContent = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className={`relative overflow-hidden bg-secondary ${compact ? "aspect-4/5" : "aspect-4/5"}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            unoptimized
            className={`object-contain transition-transform duration-300 hover:scale-105 ${compact ? "p-2" : "p-3 lg:p-4"}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        {badge ? (
          <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm">
            {badge}
          </div>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-3 lg:p-4"}`}>
        <h3 className={`line-clamp-2 font-medium text-foreground ${compact ? "text-xs" : "text-sm"}`}>
          {title}
        </h3>

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={`font-bold text-price-original ${compact ? "text-sm" : "text-base lg:text-lg"}`}>
            ${price.toFixed(2)}
          </span>

          {typeof previousPrice === "number" && previousPrice > price ? (
            <span className="text-price-discounted text-xs line-through">${previousPrice.toFixed(2)}</span>
          ) : null}
        </div>
      </div>
    </article>
  );

  if (!to) {
    return cardContent;
  }

  return (
    <Link to={to} className="block h-full">
      {cardContent}
    </Link>
  );
}
