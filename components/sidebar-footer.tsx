import { cn } from "@/lib/utils";

export function SidebarFooter() {
  const isLive = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="px-5 py-4 border-t border-[var(--border)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--muted)]">claude-sonnet-4-6</span>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-mono",
            isLive
              ? "bg-[var(--success-soft)] text-[var(--success)]"
              : "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)]"
          )}
        >
          {isLive ? "live" : "mock"}
        </span>
      </div>
    </div>
  );
}
