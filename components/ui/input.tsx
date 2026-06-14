import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full px-3 rounded-md bg-[var(--surface-2)] border border-[var(--border)]",
        "font-mono text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]",
        "focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20",
        "transition-colors",
        invalid && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
export { Input };
