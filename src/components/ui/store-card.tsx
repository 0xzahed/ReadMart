import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const storeCardVariants = cva("rounded-xl border border-border/70 bg-card shadow-sm", {
  variants: {
    tone: {
      default: "",
      elevated: "shadow-md",
      muted: "border-border/50 bg-secondary/40 shadow-none",
      clean: "border-border bg-background shadow-none",
    },
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    tone: "default",
    padding: "md",
  },
});

export interface StoreCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof storeCardVariants> {}

const StoreCard = React.forwardRef<HTMLDivElement, StoreCardProps>(
  ({ className, tone, padding, ...props }, ref) => (
    <div ref={ref} className={cn(storeCardVariants({ tone, padding }), className)} {...props} />
  ),
);

StoreCard.displayName = "StoreCard";

export { StoreCard, storeCardVariants };
