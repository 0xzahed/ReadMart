"use client";

import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Tag, Percent, Gift, Truck, Zap } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { ProductCard } from "@/components/store/ProductCard";
import { StoreButton, StoreCard, StorePageHeader } from "@/components/ui/store";

export function OffersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { promoCodes, freeDeliveryThreshold, products, categories } = useStore();
  const offerType = searchParams.get("type") || "all";
  const categoryId = searchParams.get("category") || "";

  const offerProducts = useMemo(() => {
    if (offerType === "trending") {
      return [...products]
        .sort((a, b) => b.rating * (b.reviews ?? 0) - a.rating * (a.reviews ?? 0))
        .slice(0, 20);
    }

    if (offerType === "new") {
      return [...products].slice(-20).reverse();
    }

    if (offerType === "category" && categoryId) {
      return products.filter((product) => product.category === categoryId);
    }

    return [];
  }, [categoryId, offerType, products]);

  const offerTitle = useMemo(() => {
    if (offerType === "trending") return "Trending Products";
    if (offerType === "new") return "New Products";
    if (offerType === "category") {
      const category = categories.find((item) => item.id === categoryId);
      return category ? `${category.name} Products` : "Category Products";
    }
    return "Offer Products";
  }, [categories, categoryId, offerType]);

  const offers = [
    {
      id: 1,
      icon: Truck,
      title: "Free Delivery",
      description: `On orders above $${freeDeliveryThreshold}`,
      color: "bg-blue-500",
      link: "/free-delivery",
    },
    {
      id: 2,
      icon: Zap,
      title: "Flash Deals",
      description: "Up to 50% off on selected items",
      color: "bg-red-500",
      link: "/flash-deals",
    },
    {
      id: 3,
      icon: Gift,
      title: "New User Bonus",
      description: "Extra 10% off on first order",
      color: "bg-purple-500",
      link: null,
    },
    {
      id: 4,
      icon: Percent,
      title: "Daily Deals",
      description: "New deals every day",
      color: "bg-orange-500",
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Offers & Deals" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {offerType !== "all" ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground md:text-2xl">{offerTitle}</h2>
              <Link to="/offers" className="text-sm font-medium text-primary hover:text-primary/80">
                Back to offers
              </Link>
            </div>

            {offerProducts.length === 0 ? (
              <StoreCard className="py-10 text-center text-sm text-muted-foreground">
                No products found for this section.
              </StoreCard>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {offerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Promo Codes */}
        {promoCodes.length > 0 && (
          <StoreCard>
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Available Promo Codes
            </h2>
            <div className="space-y-2">
              {promoCodes
                .filter((p) => p.isActive)
                .map((promo) => (
                  <div
                    key={promo.id}
                    className="flex items-center justify-between bg-secondary rounded-lg p-3"
                  >
                    <div>
                      <p className="font-mono font-bold text-primary">{promo.code}</p>
                      <p className="text-xs text-muted-foreground">
                        {promo.discountPercent}% off
                        {promo.expiryDate && ` • Expires: ${promo.expiryDate}`}
                      </p>
                    </div>
                    <StoreButton
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                      }}
                      tone="soft"
                      size="sm"
                    >
                      Copy
                    </StoreButton>
                  </div>
                ))}
            </div>
          </StoreCard>
        )}

        {/* Special Offers */}
        <div className="space-y-3">
          <h2 className="font-bold text-foreground mb-3">Special Offers</h2>
          <div className="space-y-3">
            {offers.map((offer) => {
              const Icon = offer.icon;
              const card = (
                <StoreCard key={offer.id} className="flex items-center gap-4">
                  <div className={`h-12 w-12 ${offer.color} shrink-0 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                </StoreCard>
              );
              return offer.link ? (
                <Link key={offer.id} to={offer.link}>{card}</Link>
              ) : (
                card
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
