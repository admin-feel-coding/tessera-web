import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "default" | "outline";
  size?: "sm" | "md";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          // size
          size === "sm" && "h-7 px-3 text-xs",
          size === "md" && "h-9 px-4 text-sm",
          // variant
          (variant === "primary" || variant === "default") &&
            "bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white",
          variant === "secondary" &&
            "bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)]/50",
          variant === "outline" &&
            "bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)]/50",
          variant === "ghost" &&
            "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
