import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/features/store/components/ProductCard";
import { products, categories } from "@/data/products";
import { useNavigate } from "react-router-dom";

export function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryFromParams = searchParams.get("q") || "";
  const [search, setSearch] = useState(queryFromParams);
  const activeCategory = searchParams.get("category") || "all";

  useEffect(() => {
    setSearch(queryFromParams);
  }, [queryFromParams]);

  const applyCategory = (category: string) => {
    const next = new URLSearchParams(searchParams);

    if (category === "all") {
      next.delete("category");
    } else {
      next.set("category", category);
    }

    if (search.trim()) {
      next.set("q", search.trim());
    } else {
      next.delete("q");
    }

    setSearchParams(next);
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pb-20 lg:pb-8">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-0"
            />
          </div>
          <SlidersHorizontal className="h-5 w-5 text-foreground" />
        </div>
      </div>

      <div className="container py-6">
        {/* Desktop search */}
        <div className="hidden lg:block mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">Explore Products</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
          <button
            onClick={() => applyCategory("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => applyCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-primary/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
