"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Image from "next/image";
import { useStore } from "@/contexts/StoreContext";
import { StoreCard, StorePageHeader } from "@/components/ui/store";

export function OffersPage() {
  const navigate = useNavigate();
  const { sliders } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeOfferSliders = sliders.filter((slider) => slider.isActive);

  useEffect(() => {
    if (activeOfferSliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeOfferSliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeOfferSliders.length]);

  return (
    <div className="min-h-screen bg-background">
      <StorePageHeader title="Offers & Deals" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {activeOfferSliders.length > 0 ? (
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-border">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
              {activeOfferSliders.map((slider) => (
                <Link
                  key={slider.id}
                  to={slider.buttonLink}
                  className="relative block aspect-video w-full shrink-0 overflow-hidden"
                >
                  <Image src={slider.image} alt={slider.title} fill className="object-cover" />
                </Link>
              ))}
              </div>
              {activeOfferSliders.length > 1 ? (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {activeOfferSliders.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-5 bg-white" : "w-2 bg-white/55"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <StoreCard className="py-10 text-center text-sm text-muted-foreground">
            No active offer banners found.
          </StoreCard>
        )}
      </div>
    </div>
  );
}
