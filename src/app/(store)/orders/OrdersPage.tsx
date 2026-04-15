"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Image from "next/image";
import { Package, ChevronRight } from "lucide-react";
import { useStore, Order } from "@/contexts/StoreContext";
import { StoreButton, StoreCard, StorePageHeader } from "@/components/ui/store";

export function OrdersPage() {
  const { orders, products } = useStore();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const [trackingInput, setTrackingInput] = useState(searchParams.get("track") || "");

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const trackedOrder = orders.find((order) => order.trackingToken === trackingInput.trim());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "confirmed":
        return "bg-info/10 text-info";
      case "delivered":
        return "bg-success/10 text-success";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const formatStatusLabel = (status: Order["status"]) => {
    if (status === "confirmed") return "confirmed";
    if (status === "cancelled") return "rejected";
    if (status === "delivered") return "delivered";
    return "pending";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <StorePageHeader title="My Orders" backTo="/" />

      <div className="mx-auto w-full max-w-330 px-4 pt-4 sm:px-6 lg:px-8">
        <StoreCard className="space-y-3">
          <h3 className="font-semibold text-foreground">Check by Tracking Link</h3>
          <input
            type="text"
            value={trackingInput}
            onChange={(e) => {
              const value = e.target.value;
              const parsedToken = value.includes("track=") ? value.split("track=")[1] : value;
              setTrackingInput(parsedToken);
            }}
            placeholder="Paste tracking link or token"
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
          {trackingInput.trim() ? (
            trackedOrder ? (
              <div className="rounded-lg border border-border/70 bg-secondary/30 p-3">
                <p className="text-sm text-foreground">Order: #{trackedOrder.id}</p>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-semibold capitalize text-foreground">{formatStatusLabel(trackedOrder.status)}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-destructive">Tracking order not found.</p>
            )
          ) : null}
        </StoreCard>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 border-b border-border">
        <div className="mx-auto w-full max-w-330 overflow-x-auto px-4 py-3 scrollbar-hide sm:px-6 lg:px-8">
          <div className="flex gap-2">
          {(["all", "pending", "confirmed", "delivered", "cancelled"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="mx-auto flex min-h-[60vh] w-full max-w-330 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders found</p>
          <StoreButton asChild size="lg">
            <Link to="/">Start Shopping</Link>
          </StoreButton>
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-330 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-8">
          {filteredOrders.map((order) => (
            <StoreCard key={order.id} className="transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                    order.status
                  )}`}
                >
                  {formatStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                {(() => {
                  const firstItem = order.items[0];
                  const firstProduct = products.find((p) => p.id === firstItem?.productId);
                  return firstProduct ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={firstProduct.images[0]} alt={firstProduct.name} fill className="object-cover" />
                    </div>
                  ) : null;
                })()}
                <div>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </StoreCard>
          ))}
        </div>
      )}
    </div>
  );
}
