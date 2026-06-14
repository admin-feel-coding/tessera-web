"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Inbox, BarChart2, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/analyze", label: "Analyze", icon: Search },
  { href: "/queue", label: "Queue", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/evals", label: "Evals", icon: FlaskConical },
];

export function MobileHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Top bar — logo */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-12 bg-[var(--sidebar-bg)] border-b border-[var(--border)] flex items-center px-4 gap-2.5">
        <div className="w-5 h-5 rounded-[4px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0">
          T
        </div>
        <span className="text-sm font-semibold tracking-[-0.3px] text-[var(--foreground)]">Tessera</span>
      </header>

      {/* Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--sidebar-bg)] border-t border-[var(--border)] flex safe-area-inset-bottom">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-[var(--accent)]" : "text-[var(--muted)]"
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
