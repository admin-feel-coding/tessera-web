import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label>{label}</Label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}
