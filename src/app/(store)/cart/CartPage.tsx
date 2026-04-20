"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "next/image";
import { Link } from "react-router-dom";
import {
  Trash2,
  Edit2,
  Minus,
  Plus,
  Tag,
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { StoreButton, StoreCard, StorePageHeader } from "@/components/ui/store";
import { toast } from "sonner";

export function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    products,
    removeFromCart,
    updateCartItemQuantity,
    updateCartItemColor,
    clearCart,
    getCartTotal,
    applyPromoCode,
    deliveryCharge,
    freeDeliveryThreshold,
    placeOrder,
    addNotification,
  } = useStore();

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return { ...item, product };
  }).filter((item) => item.product) as Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
    product: (typeof products)[0];
  }>;

  const subtotal = getCartTotal();
  const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const discount = (subtotal * appliedDiscount) / 100;
  const total = subtotal - discount + delivery;

  const handleApplyPromoCode = () => {
    const discountPercent = applyPromoCode(promoCode);
    if (discountPercent > 0) {
      setAppliedDiscount(discountPercent);
      toast.success(`Promo code applied! ${discountPercent}% discount`);
    } else {
      toast.error("Invalid or expired promo code");
    }
  };

  const handleDeleteAll = () => {
    const confirmed = window.confirm("Are you sure you want to delete all cart items?");
    if (!confirmed) return;
    clearCart();
    toast.success("All items removed from cart");
  };

  const handleRemoveItem = (productId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
    removeFromCart(productId);
    toast.success("Item deleted successfully");
  };

  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity <= 1) {
      handleRemoveItem(productId);
      return;
    }
    updateCartItemQuantity(productId, currentQuantity - 1);
  };

  const handleEditColor = (productId: string, currentColor: string) => {
    setEditingProductId(productId);
    setSelectedColor(currentColor);
    setShowEditModal(true);
  };

  const handleSaveColor = () => {
    if (editingProductId && selectedColor) {
      updateCartItemColor(editingProductId, selectedColor);
      toast.success("Color variant updated");
    }
    setShowEditModal(false);
    setEditingProductId(null);
  };

  const handleCheckout = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    const order = placeOrder({
      items: cart,
      total,
      subtotal,
      discount,
      deliveryCharge: delivery,
      status: "pending",
      customerName,
      customerPhone,
      customerAddress,
      promoCode: appliedDiscount > 0 ? promoCode : undefined,
    });

    addNotification({
      title: "Order Placed Successfully",
      message: `Your order #${order.id} has been placed successfully!`,
      type: "success",
    });

    toast.success("Order placed successfully!");
    setShowCheckout(false);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setPromoCode("");
    setAppliedDiscount(0);
    navigate(`/order-confirmation?track=${encodeURIComponent(order.trackingToken || "")}`);
  };

  const editingProduct = products.find((p) => p.id === editingProductId);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StorePageHeader title="Cart" onBack={() => navigate(-1)} />
        <div className="mx-auto flex min-h-[60vh] w-full max-w-[1400px] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <StoreButton asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </StoreButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-[calc(8.5rem+env(safe-area-inset-bottom))] lg:pb-10">
      <StorePageHeader
        title={`Cart (${cartItems.length})`}
        onBack={() => navigate(-1)}
        rightAction={(
          <StoreButton tone="danger" size="icon" onClick={handleDeleteAll} aria-label="Delete all cart items">
            <Trash2 className="h-5 w-5" />
          </StoreButton>
        )}
      />

      {/* Cart Items */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-5 space-y-4 sm:px-6 lg:px-8 lg:py-8">
        {cartItems.map((item) => (
          <StoreCard key={item.productId}>
            <div className="flex flex-wrap gap-3">
              {/* Product Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary sm:h-24 sm:w-24">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-foreground truncate">
                  {item.product.name}
                </h3>
                {item.selectedColor && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Color: {item.selectedColor}
                  </p>
                )}
                <p className="mt-2 text-lg font-bold text-muted-foreground">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>

                {/* Edit Button */}
                <StoreButton
                  onClick={() =>
                    handleEditColor(item.productId, item.selectedColor || "")
                  }
                  tone="ghost"
                  size="sm"
                  className="mt-2 px-0"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </StoreButton>
              </div>

              {/* Quantity Controls */}
              <div className="flex w-full items-center justify-between sm:w-auto sm:flex-col sm:items-end sm:justify-between">
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => handleDecreaseQuantity(item.productId, item.quantity)}
                    className="p-1 hover:bg-background rounded transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartItemQuantity(item.productId, item.quantity + 1)
                    }
                    className="p-1 hover:bg-background rounded transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </StoreCard>
        ))}
      </div>

      {/* Promo Code */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <StoreCard>
          <h3 className="font-semibold text-foreground mb-3">Promo Code</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1 relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <StoreButton
              onClick={handleApplyPromoCode}
              size="md"
              className="shrink-0 sm:min-w-[7rem]"
            >
              Apply
            </StoreButton>
          </div>
          {appliedDiscount > 0 && (
            <p className="text-sm text-success mt-2">
              ✓ {appliedDiscount}% discount applied
            </p>
          )}
        </StoreCard>
      </div>

      {/* Order Summary */}
      <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
        <StoreCard className="space-y-3">
          <h3 className="font-semibold text-foreground">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({appliedDiscount}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span>
                {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </StoreCard>
      </div>

      <div className="mx-auto hidden w-full max-w-[1400px] px-4 pb-10 sm:px-6 lg:block lg:px-8">
        <StoreButton
          onClick={() => setShowCheckout(true)}
          fullWidth
          size="lg"
        >
          Checkout
        </StoreButton>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto w-full max-w-[1400px]">
          <StoreButton
            onClick={() => setShowCheckout(true)}
            fullWidth
            size="lg"
          >
            Checkout
          </StoreButton>
        </div>
      </div>

      {/* Edit Color Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Change Color</h3>
            <div className="space-y-2 mb-6">
              {editingProduct.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                    selectedColor === color
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <StoreButton
                onClick={() => setShowEditModal(false)}
                tone="secondary"
                fullWidth
                size="lg"
              >
                Cancel
              </StoreButton>
              <StoreButton
                onClick={handleSaveColor}
                fullWidth
                size="lg"
              >
                Save
              </StoreButton>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-card rounded-t-xl md:rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Checkout</h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  placeholder="Delivery address"
                />
              </div>
            </div>

            <StoreButton
              onClick={handleCheckout}
              fullWidth
              size="lg"
            >
              Place Order
            </StoreButton>
          </div>
        </div>
      )}

    </div>
  );
}
