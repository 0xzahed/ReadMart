import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="pb-20 lg:pb-8">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background px-4 py-3 lg:hidden">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold">My Cart ({items.length})</h1>
      </div>

      <div className="container py-6">
        <h1 className="hidden text-2xl font-bold text-foreground mb-6 lg:block">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link to="/explore">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 rounded-xl border border-border p-3">
                  <Link to={`/product/${item.product.id}`}>
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      <img src={item.product.image} alt={item.product.name} className="h-full w-full object-contain p-2" />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                        {item.selectedSize && ` · Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.product.id)} className="ml-2">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:w-80">
              <div className="rounded-xl border border-border p-5 space-y-4">
                <h3 className="font-semibold text-foreground">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-status-success">Free</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="font-bold text-primary text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl text-base font-semibold">Checkout</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
