"use client";

import { Package } from "lucide-react";
import { CartItem, Product } from "@/contexts/StoreContext";

interface OrderItemProps {
  item: CartItem;
  product?: Product;
}

export function OrderItem({ item, product }: OrderItemProps) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
      <Package className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {product?.name || "Unknown Product"}
        </p>
        <p className="text-sm text-muted-foreground">
          Qty: {item.quantity}
          {item.selectedColor && ` • ${item.selectedColor}`}
        </p>
      </div>
    </div>
  );
}
