"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { StoreButton } from "./store-button";

type StorePageHeaderProps = {
  title: string;
  backTo?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function StorePageHeader({
  title,
  backTo,
  onBack,
  rightAction,
  className,
  titleClassName,
}: StorePageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur", className)}>
      <div className="mx-auto flex w-full max-w-330 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {backTo ? (
            <StoreButton asChild tone="ghost" size="icon" className="hover:bg-transparent" aria-label="Go back">
              <Link to={backTo}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </StoreButton>
          ) : onBack ? (
            <StoreButton
              tone="ghost"
              size="icon"
              className="hover:bg-transparent"
              onClick={onBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </StoreButton>
          ) : null}

          <h1 className={cn("truncate text-lg font-bold text-foreground", titleClassName)}>{title}</h1>
        </div>

        {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
      </div>
    </header>
  );
}
