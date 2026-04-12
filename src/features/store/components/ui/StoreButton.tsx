import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const storeButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-foreground hover:bg-secondary/80",
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
        outline: "border border-border bg-background text-foreground hover:bg-secondary/60",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "text-foreground hover:bg-secondary/60",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      tone: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface StoreButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof storeButtonVariants> {
  asChild?: boolean;
}

const StoreButton = React.forwardRef<HTMLButtonElement, StoreButtonProps>(
  ({ className, tone, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(storeButtonVariants({ tone, size, fullWidth }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);

StoreButton.displayName = "StoreButton";

export { StoreButton, storeButtonVariants };
