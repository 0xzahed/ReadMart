"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { useStore, Order } from "@/contexts/StoreContext";

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

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
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link to="/" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">My Orders</h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 border-b border-border overflow-x-auto scrollbar-hide">
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders found</p>
          <Link
            to="/"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-4">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              to={`/order/${order.id}`}
              className="block bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
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
                  {order.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
