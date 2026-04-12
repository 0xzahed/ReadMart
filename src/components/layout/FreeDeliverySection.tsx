"use client";

import { Link } from "react-router-dom";
import { Truck, ChevronRight } from "lucide-react";

export function FreeDeliverySection() {
  return (
    <section className="py-6 md:py-8 lg:py-9">
      <div className="mx-auto w-full max-w-330 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-linear-to-r from-primary/10 to-accent/10 p-4 md:p-6 lg:rounded-[28px] lg:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 p-3 md:p-4">
                <Truck className="h-6 w-6 text-primary md:h-8 md:w-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground md:text-lg lg:text-xl">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">On orders over $500</p>
              </div>
            </div>
            <Link
              to="/offers"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
