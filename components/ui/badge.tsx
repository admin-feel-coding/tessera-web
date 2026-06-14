import { cn } from "@/lib/utils";

type BadgeVariant = "approve" | "decline" | "escalate" | "flag" | "ok" | "default";

const variantClasses: Record<BadgeVariant, string> = {
  approve: "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30",
  decline: "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30",
  escalate: "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/30",
  flag: "bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger)]/30",
  ok: "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]/30",
  default: "bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border-strong)]",
};

const decisionVariants: Set<BadgeVariant> = new Set(["approve", "decline", "escalate"]);

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const isDecision = decisionVariants.has(variant);
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full",
        isDecision
          ? "text-[10px] font-mono font-semibold tracking-widest uppercase"
          : "text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
