"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "next/image";
import { useStore } from "@/contexts/StoreContext";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

export function HeroSlider() {
  const { sliders } = useStore();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSliders = sliders.filter((s) => s.isActive);

  useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || activeSliders.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api, activeSliders.length]);

  if (activeSliders.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden pt-3 md:pt-4 lg:pt-6">
      <div className="mx-auto w-full px-2 sm:px-4 lg:px-8 md:max-w-[480px]">
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="relative overflow-hidden rounded-xl border border-border/40 shadow-sm sm:rounded-2xl lg:rounded-[28px]"
        >
          <CarouselContent className="ml-0">
            {activeSliders.map((slider) => (
              <CarouselItem key={slider.id} className="pl-0">
                <div className="relative aspect-video w-full bg-secondary">
                  <Image
                    src={slider.image}
                    alt={slider.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-end px-6 pb-6 md:px-10 md:pb-8">
                    <Link
                      to={slider.buttonLink}
                      className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/90 md:px-8 md:py-3 md:text-base"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {activeSliders.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
              {activeSliders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? "w-6 bg-white" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
}
