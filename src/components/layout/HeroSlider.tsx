"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export function HeroSlider() {
  const { sliders } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeSliders = sliders.filter((s) => s.isActive);

  useEffect(() => {
    if (activeSliders.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSliders.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSliders.length) % activeSliders.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSliders.length);
  };

  if (activeSliders.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden pt-3 md:pt-4 lg:pt-6">
      {/* Slider Container */}
      <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 shadow-sm lg:rounded-[28px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeSliders.map((slider) => (
            <div key={slider.id} className="relative w-full shrink-0">
              {/* Image */}
              <div className="relative h-55 w-full bg-secondary sm:h-70 lg:h-95 xl:h-107.5">
                <Image
                  src={slider.image}
                  alt={slider.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback for missing images
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
                  <h2 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
                    {slider.title}
                  </h2>
                  {slider.subtitle && (
                    <p className="mb-4 max-w-xl text-sm text-white/90 md:mb-6 md:text-lg">
                      {slider.subtitle}
                    </p>
                  )}
                  <Link
                    to={slider.buttonLink}
                    className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/90 md:px-8 md:py-3 md:text-base"
                  >
                    {slider.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {activeSliders.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white md:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white md:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {activeSliders.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
            {activeSliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
