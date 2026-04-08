import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/features/store/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist } = useCart();

  return (
    <div className="pb-20 lg:pb-8">
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold">My Wishlist ({wishlist.length})</h1>
      </div>

      <div className="container py-6">
        <h1 className="hidden text-2xl font-bold text-foreground mb-6 lg:block">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/explore">
              <Button>Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {wishlist.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
