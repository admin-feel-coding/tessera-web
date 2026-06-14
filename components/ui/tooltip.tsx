import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <div className={cn("relative group inline-flex", className)}>
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <div className="px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--foreground)] whitespace-nowrap shadow-lg">
          {content}
        </div>
      </div>
    </div>
  );
}
