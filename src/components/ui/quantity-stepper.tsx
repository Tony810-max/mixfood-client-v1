
import { useUiText } from '@/contexts/LanguageContext';
import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
}

/**
 * Quantity stepper — a single bordered pill housing decrement/value/increment,
 * built on lucide icons instead of raw "−"/"+" glyphs so both buttons align
 * on the same baseline (two separate circles with a bare minus character was
 * the source of the visual misalignment this replaces).
 */
export const QuantityStepper = React.forwardRef<HTMLDivElement, QuantityStepperProps>(
  ({ value, onChange, min = 0, max = 99, disabled, className, size = "default" }, ref) => {
  const ui = useUiText();
    const dec = () => onChange(Math.max(min, value - 1));
    const inc = () => onChange(Math.min(max, value + 1));
    const height = size === "sm" ? "h-9" : "h-10";
    const buttonWidth = size === "sm" ? "w-9" : "w-10";
    const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ui("Số lượng")}
        className={cn(
          "inline-flex items-center rounded-full border border-border bg-card overflow-hidden",
          height,
          className,
        )}
      >
        <button
          type="button"
          onClick={dec}
          disabled={disabled || value <= min}
          aria-label={ui("Giảm số lượng")}
          className={cn(
            "flex h-full shrink-0 items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none",
            buttonWidth,
          )}
        >
          <Minus className={iconSize} />
        </button>
        <span className="min-w-8 px-0.5 text-center text-sm font-semibold tabular-nums select-none">
          {value}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={disabled || value >= max}
          aria-label={ui("Tăng số lượng")}
          className={cn(
            "flex h-full shrink-0 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-30 disabled:pointer-events-none",
            buttonWidth,
          )}
        >
          <Plus className={iconSize} />
        </button>
      </div>
    );
  },
);
QuantityStepper.displayName = "QuantityStepper";
