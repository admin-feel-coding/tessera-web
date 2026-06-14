"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Inbox, BarChart2, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarFooter } from "./sidebar-footer";

const NAV_ITEMS = [
  { href: "/analyze", label: "Analyze", icon: Search },
  { href: "/queue", label: "Queue", icon: Inbox },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/evals", label: "Evals", icon: FlaskConical },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] hidden md:flex flex-col bg-[var(--sidebar-bg)] border-r border-[var(--border)]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)] flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-[5px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
          T
        </div>
        <span className="text-sm font-semibold tracking-[-0.3px] text-[var(--foreground)]">
          Tessera
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "text-[var(--foreground)] bg-[var(--surface-2)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
      <SidebarFooter />
    </aside>
  );
}
