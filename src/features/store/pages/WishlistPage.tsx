import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/features/store/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist } = useCart();

  return (
    <div className="pb-24 lg:pb-10">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold">My Wishlist ({wishlist.length})</h1>
      </div>

      <div className="mx-auto w-full max-w-330 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <h1 className="mb-6 hidden text-3xl font-bold text-foreground lg:block">
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="rounded-2xl border border-border/60 py-20 text-center">
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/explore">
              <Button>Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {wishlist.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
