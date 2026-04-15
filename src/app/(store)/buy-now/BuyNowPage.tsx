"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import { StoreButton, StoreCard, StorePageHeader } from "@/components/ui/store";

export function BuyNowPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { products, placeOrder, addNotification } = useStore();

  const quantityFromUrl = Number(searchParams.get("qty") || "1");
  const colorFromUrl = searchParams.get("color") || "";

  const product = products.find((p) => p.id === id);
  const quantity = Number.isFinite(quantityFromUrl) && quantityFromUrl > 0 ? quantityFromUrl : 1;
  const selectedColor = colorFromUrl || product?.colors?.[0] || "";

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const subtotal = useMemo(() => {
    if (!product) return 0;
    return product.price * quantity;
  }, [product, quantity]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-3 text-muted-foreground">Product not found</p>
          <Link to="/" className="font-semibold text-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      toast.error("Please fill name, phone and address");
      return;
    }

    const order = placeOrder({
      items: [{ productId: product.id, quantity, selectedColor }],
      total: subtotal,
      subtotal,
      discount: 0,
      deliveryCharge: 0,
      status: "pending",
      customerName,
      customerPhone,
      customerAddress,
    });

    addNotification({
      title: "Order placed",
      message: `Track your order with ${order.trackingToken}`,
      type: "success",
    });

    toast.success("Order placed successfully!");
    navigate(`/order-confirmation?track=${encodeURIComponent(order.trackingToken || "")}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <StorePageHeader title="Buy Product" onBack={() => navigate(-1)} />

      <div className="mx-auto w-full max-w-330 space-y-4 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <StoreCard>
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-secondary">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="line-clamp-1 font-semibold text-foreground">{product.name}</h2>
              <p className="text-sm text-muted-foreground">Qty: {quantity} • {selectedColor}</p>
              <p className="mt-1 text-lg font-bold text-foreground">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </StoreCard>

        <StoreCard className="space-y-3">
          <h3 className="font-semibold text-foreground">Delivery Information</h3>
          <input
            type="text"
            placeholder="Your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
          <input
            type="tel"
            placeholder="Mobile number"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
          />
          <textarea
            rows={3}
            placeholder="Delivery address"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
          <StoreButton onClick={handlePlaceOrder} fullWidth size="lg">
            Order Now
          </StoreButton>
        </StoreCard>

      </div>
    </div>
  );
}
