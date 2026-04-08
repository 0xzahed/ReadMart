import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShoppingCart, Star, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/features/store/components/ProductCard";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);

  if (!product) return <div className="flex h-screen items-center justify-center text-muted-foreground">Product not found</div>;

  const related = products.filter((p) => p.category === product.category && p.id !== product.id);
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="pb-24 lg:pb-8">
      {/* Mobile back */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold">Product Details</h1>
      </div>

      <div className="container lg:py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Image */}
          <div className="flex-1">
            <div className="rounded-2xl bg-secondary p-8">
              <img src={product.image} alt={product.name} className="mx-auto max-h-[400px] object-contain" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5 px-4 lg:px-0">
            {product.badge && (
              <span className="inline-block rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">{product.badge}</span>
            )}
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Colors */}
            {product.colors && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Color</h3>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === c ? "border-primary scale-110" : "border-border"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize === s
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Quantity</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`h-5 w-5 ${wishlisted ? "fill-primary text-primary" : ""}`} />
              </Button>
              <Button
                className="h-12 flex-1 rounded-xl text-base font-semibold"
                onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 px-4 lg:px-0">
            <h2 className="text-lg font-bold text-foreground mb-4">Related Products</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
