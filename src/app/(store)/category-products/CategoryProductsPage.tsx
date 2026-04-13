"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useStore } from "@/contexts/StoreContext";

export function CategoryProductsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, products } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<Record<string, string>>({});

  const category = categories.find((item) => item.id === id);
  const currentCategoryId = id || "";
  const selectedSubcategory = subcategoryFilter[currentCategoryId] || "all";
  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === id),
    [id, products],
  );

  const availableSubcategories = useMemo(() => {
    const fromCategory = (category?.subcategories || []).map((item) => item.trim()).filter(Boolean);
    const fromProducts = categoryProducts
      .map((product) => product.subcategory?.trim() || "")
      .filter(Boolean);

    return Array.from(new Set([...fromCategory, ...fromProducts]));
  }, [category?.subcategories, categoryProducts]);

  const subcategoryCards = useMemo(() => {
    const allCard = {
      key: "all",
      name: "All",
      count: categoryProducts.length,
      image: category?.image || categoryProducts[0]?.images?.[0] || "",
      filterValue: "all",
    };

    const cards = availableSubcategories.map((subcategory) => {
      const subcategoryProducts = categoryProducts.filter(
        (product) => (product.subcategory || "").trim() === subcategory,
      );
      const representativeImage = subcategoryProducts[0]?.images?.[0] || category?.image || "";

      return {
        key: subcategory,
        name: subcategory,
        count: subcategoryProducts.length,
        image: representativeImage,
        filterValue: subcategory,
      };
    });

    const fallbackLabels = ["Popular", "Trending", "New"];
    const minimumSubcards = 3;
    const missingCardCount = Math.max(0, minimumSubcards - cards.length);

    const fallbackCards = fallbackLabels.slice(0, missingCardCount).map((label, index) => ({
      key: `fallback-${index + 1}`,
      name: label,
      count: categoryProducts.length,
      image: allCard.image,
      filterValue: "all",
    }));

    return [allCard, ...cards, ...fallbackCards];
  }, [availableSubcategories, categoryProducts, category?.image]);

  const selectedCard = subcategoryCards.find((card) => card.key === selectedSubcategory);
  const activeSubcategoryFilter = selectedCard?.filterValue || "all";

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      if (
        activeSubcategoryFilter !== "all" &&
        (product.subcategory || "").trim() !== activeSubcategoryFilter
      ) {
        return false;
      }

      if (!searchQuery.trim()) return true;

      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeSubcategoryFilter, categoryProducts, searchQuery]);

  if (!category) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="mb-4 text-muted-foreground">Category not found</p>
        <Link to="/categories" className="font-semibold text-primary hover:text-primary/80">
          Go back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-330 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-2 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-foreground md:text-xl">{category.name}</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Search in ${category.name}`}
              className="h-11 w-full rounded-full border-0 bg-secondary pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-330 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <section className="mb-6">
          <h2 className="mb-3 text-base font-bold text-foreground md:text-lg">Sub Categories</h2>
          <Carousel
            opts={{ align: "start", dragFree: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 py-1">
              {subcategoryCards.map((subcategory) => {
                const isSelected = selectedSubcategory === subcategory.key;

                return (
                  <CarouselItem key={subcategory.key} className="basis-1/4 pl-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSubcategoryFilter((prev) => ({
                          ...prev,
                          [currentCategoryId]: subcategory.key,
                        }))
                      }
                      className="group flex w-full flex-col items-center"
                    >
                      <div
                        className={`relative mb-1 aspect-square w-full overflow-hidden rounded-lg bg-secondary border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${
                          isSelected ? "border-red-400" : "border-border/60"
                        }`}
                      >
                        {subcategory.image ? (
                          <Image
                            src={subcategory.image}
                            alt={subcategory.name}
                            fill
                            className="object-cover p-2"
                          />
                        ) : null}
                      </div>
                      <span
                        className={`w-full truncate text-center text-[11px] font-medium ${
                          isSelected ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {subcategory.name}
                      </span>
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </section>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          {selectedSubcategory !== "all" ? (
            <p className="text-sm text-muted-foreground">in {selectedCard?.name}</p>
          ) : null}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-border/60 py-20 text-center text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
