import { cn } from "@/lib/utils";

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 h-5 rounded border border-[var(--border-strong)]",
        "bg-[var(--surface-2)] text-[10px] font-mono text-[var(--muted)]",
        className
      )}
    >
      {children}
    </span>
  );
}
