import { cn } from "@/lib/utils";

type BadgeVariant = "approve" | "decline" | "escalate" | "flag" | "ok" | "default";

const variantClasses: Record<BadgeVariant, string> = {
  approve: "bg-green-100 text-green-800 border-green-200",
  decline: "bg-red-100 text-red-800 border-red-200",
  escalate: "bg-amber-100 text-amber-800 border-amber-200",
  flag: "bg-red-100 text-red-700 border-red-200",
  ok: "bg-green-100 text-green-700 border-green-200",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
