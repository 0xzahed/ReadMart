"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Check, CheckCircle, CircleDashed } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { StoreButton, StoreCard } from "@/components/ui/store";
import { OrderItem } from "./components/OrderItem";

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, products } = useStore();
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  const trackToken = searchParams.get("track") || "";
  const latestOrder = useMemo(() => {
    if (trackToken) {
      const matched = orders.find((order) => order.trackingToken === trackToken);
      if (matched) return matched;
    }
    return orders[orders.length - 1];
  }, [orders, trackToken]);
  const trackingLink =
    typeof window !== "undefined" && latestOrder?.trackingToken
      ? `${window.location.origin}/orders?track=${latestOrder.trackingToken}`
      : "";

  useEffect(() => {
    const timers = [500, 900, 1300].map((delay, index) =>
      window.setTimeout(() => {
        setVisibleStepCount(index + 1);
      }, delay)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

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

      <div className="px-4 py-4">
        <StoreCard padding="lg">
          <h3 className="mb-3 font-semibold text-foreground">Order placed</h3>
          <div className="space-y-2">
            {["Order received", "Payment confirmed", "Preparing for delivery"].map((label, index) => {
              const isDone = visibleStepCount > index;
              return (
                <div key={label} className="flex items-center gap-2">
                  {isDone ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <CircleDashed className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={isDone ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                </div>
              );
            })}
          </div>
        </StoreCard>
      </div>

      {/* Order Details */}
      <div className="px-4 py-6 -mt-6">
        <StoreCard tone="elevated" padding="lg">
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
                ✓ Promo code &quot;{latestOrder.promoCode}&quot; applied
              </p>
            </div>
          )}
        </StoreCard>
      </div>

      {/* Customer Info */}
      <div className="px-4 py-4">
        <StoreCard padding="lg">
          <h3 className="font-semibold text-foreground mb-3">Delivery Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-foreground font-medium">{latestOrder.customerName}</p>
            <p className="text-muted-foreground">{latestOrder.customerPhone}</p>
            <p className="text-muted-foreground">{latestOrder.customerAddress}</p>
          </div>
        </StoreCard>
      </div>

      {/* Order Items */}
      <div className="px-4 py-4">
        <StoreCard padding="lg">
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
        </StoreCard>
      </div>

      {/* Actions */}
      <div className="px-4 py-6 space-y-3">
        <StoreButton asChild fullWidth size="lg">
          <Link to="/">Go to Home</Link>
        </StoreButton>
        {trackingLink ? (
          <>
            <Link
              to={`/orders?track=${encodeURIComponent(latestOrder.trackingToken || "")}`}
              className="block text-center text-sm font-medium text-primary underline underline-offset-2"
            >
              Track this order
            </Link>
            <StoreButton
              tone="secondary"
              fullWidth
              onClick={async () => {
                await navigator.clipboard.writeText(trackingLink);
              }}
            >
              Copy Tracking Link
            </StoreButton>
          </>
        ) : null}
        <StoreButton onClick={() => navigate("/orders")} tone="ghost" fullWidth>
          View All Orders
        </StoreButton>
      </div>
    </div>
  );
}
