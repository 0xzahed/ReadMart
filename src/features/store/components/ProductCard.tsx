import Image from "next/image";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="group h-full animate-fade-in">
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative overflow-hidden rounded-t-2xl bg-secondary">
            {product.badge && (
              <span className="absolute left-3 top-3 z-10 rounded-md bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {product.badge}
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              width={512}
              height={512}
              className="aspect-4/5 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 lg:aspect-square lg:p-5"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 p-3 lg:p-4">
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground lg:text-[15px]">
              {product.name}
            </h3>

            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-rating text-rating" />
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>

            <div className="mt-auto flex items-center gap-2">
              <span className="text-sm font-bold text-foreground lg:text-base">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
