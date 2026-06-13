import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          variant === "default" && "bg-neutral-900 text-white hover:bg-neutral-800",
          variant === "outline" && "border border-neutral-200 hover:bg-neutral-100",
          variant === "ghost" && "hover:bg-neutral-100",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
