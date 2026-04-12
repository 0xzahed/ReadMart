"use client";

import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, Package } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { OrderItem } from "./OrderItem";

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orders, products } = useStore();

  const latestOrder = orders[orders.length - 1];

  if (!latestOrder) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No orders found</p>
          <Link to="/" className="text-primary hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-warning";
      case "confirmed":
        return "text-info";
      case "delivered":
        return "text-success";
      case "cancelled":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Success Header */}
      <div className="bg-success/10 py-12 px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-muted-foreground">
          Your order has been confirmed and will be processed soon
        </p>
      </div>

      {/* Order Details */}
      <div className="px-4 py-6 -mt-6">
        <div className="bg-card rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-foreground">#{latestOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`font-bold capitalize ${getStatusColor(latestOrder.status)}`}>
                {latestOrder.status}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${latestOrder.subtotal.toFixed(2)}</span>
            </div>
            {latestOrder.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-success">-${latestOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-foreground">
                {latestOrder.deliveryCharge === 0
                  ? "FREE"
                  : `$${latestOrder.deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${latestOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {latestOrder.promoCode && (
            <div className="mt-4 p-3 bg-success/10 rounded-lg">
              <p className="text-sm text-success">
                ✓ Promo code "{latestOrder.promoCode}" applied
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Info */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Delivery Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-foreground font-medium">{latestOrder.customerName}</p>
            <p className="text-muted-foreground">{latestOrder.customerPhone}</p>
            <p className="text-muted-foreground">{latestOrder.customerAddress}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">Items ({latestOrder.items.length})</h3>
          <div className="space-y-3">
            {latestOrder.items.map((item, index) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <OrderItem
                  key={index}
                  item={item}
                  product={product}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-6 space-y-3">
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          View All Orders
        </button>
        <Link
          to="/"
          className="block w-full text-center bg-secondary text-foreground py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
