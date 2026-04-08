import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import ProductCard from "@/features/store/components/ProductCard";
import { products, categories } from "@/data/products";
import bannerHero from "@/assets/banner-hero.jpg";

const heroSlides = [
  { id: 1, image: bannerHero.src, alt: "Stroller collection promotional banner" },
  { id: 2, image: bannerHero.src, alt: "Baby stroller offer banner" },
  { id: 3, image: bannerHero.src, alt: "Top stroller deals banner" },
];

export function HomePage() {
  const [heroApi, setHeroApi] = useState<CarouselApi>();
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [categoryApi, setCategoryApi] = useState<CarouselApi>();
  const [canCategoryPrev, setCanCategoryPrev] = useState(false);
  const [canCategoryNext, setCanCategoryNext] = useState(false);

  const featuredCategories = categories.map((category) => ({
    id: category.id,
    title: `More ${category.name}`,
    image: products.find((product) => product.category === category.id)?.image ?? bannerHero.src,
  }));

  useEffect(() => {
    if (!heroApi) {
      return;
    }

    const onSelect = () => {
      setActiveHeroSlide(heroApi.selectedScrollSnap());
    };

    onSelect();
    heroApi.on("select", onSelect);
    heroApi.on("reInit", onSelect);

    return () => {
      heroApi.off("select", onSelect);
      heroApi.off("reInit", onSelect);
    };
  }, [heroApi]);

  useEffect(() => {
    if (!heroApi) {
      return;
    }

    const sliderTimer = window.setInterval(() => {
      heroApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(sliderTimer);
  }, [heroApi]);

  useEffect(() => {
    if (!categoryApi) {
      return;
    }

    const updateControls = () => {
      setCanCategoryPrev(categoryApi.canScrollPrev());
      setCanCategoryNext(categoryApi.canScrollNext());
    };

    updateControls();
    categoryApi.on("select", updateControls);
    categoryApi.on("reInit", updateControls);

    return () => {
      categoryApi.off("select", updateControls);
      categoryApi.off("reInit", updateControls);
    };
  }, [categoryApi]);

  const goToPrevSlide = () => {
    heroApi?.scrollPrev();
  };

  const goToNextSlide = () => {
    heroApi?.scrollNext();
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero Slider */}
      <section className="container py-4 lg:py-6">
        <Carousel
          setApi={setHeroApi}
          opts={{ loop: true, align: "start" }}
          className="relative overflow-hidden rounded-2xl border border-border/60"
        >
          <CarouselContent className="ml-0">
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  width={1920}
                  height={540}
                  className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[420px]"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 lg:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 lg:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => heroApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeHeroSlide ? "w-6 bg-white" : "w-2.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </Carousel>
      </section>

      {/* Categories */}
      <section className="container py-8">
        <div className="rounded-2xl bg-zinc-100 px-4 py-6 sm:px-6">
          <h2 className="text-center text-2xl font-extrabold tracking-wide text-foreground">
            FEATURED CATEGORIES
          </h2>

          <div className="relative mt-6">
            <Carousel
              setApi={setCategoryApi}
              opts={{ loop: false, align: "start" }}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {featuredCategories.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="basis-1/2 pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                  >
                    <Link
                      to={`/explore?category=${category.id}`}
                      className="group flex flex-col items-center gap-3 px-1 text-center"
                    >
                      <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-300 bg-white shadow-sm sm:h-32 sm:w-32">
                        <img
                          src={category.image}
                          alt={category.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{category.title}</span>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {canCategoryPrev ? (
              <button
                type="button"
                onClick={() => categoryApi?.scrollPrev()}
                aria-label="Previous categories"
                className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition hover:bg-slate-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : null}

            {canCategoryNext ? (
              <button
                type="button"
                onClick={() => categoryApi?.scrollNext()}
                aria-label="Next categories"
                className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition hover:bg-slate-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="container py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Flash Sale</h2>
          <Link to="/explore" className="text-sm text-primary font-medium">See All</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products
            .filter((p) => p.originalPrice)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      {/* Popular */}
      <section className="container py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Popular Products</h2>
          <Link to="/explore" className="text-sm text-primary font-medium">See All</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
