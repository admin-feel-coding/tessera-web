import Link from "next/link";
import { listVerdicts } from "@/lib/api";
import type { Verdict } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

function decisionVariant(
  decision: Verdict["decision"]
): "approve" | "decline" | "escalate" {
  if (decision === "APPROVE") return "approve";
  if (decision === "DECLINE") return "decline";
  return "escalate";
}

function riskPill(score: number) {
  const pct = Math.round(score * 100);
  if (pct < 40) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-soft)] text-[var(--success)]">
        {pct}%
      </span>
    );
  }
  if (pct < 70) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--warning-soft)] text-[var(--warning)]">
        {pct}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--danger-soft)] text-[var(--danger)]">
      {pct}%
    </span>
  );
}

type FilterValue = "all" | "approve" | "decline" | "escalate" | "feedback";

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approve", label: "Approved" },
  { value: "decline", label: "Declined" },
  { value: "escalate", label: "Escalated" },
  { value: "feedback", label: "Feedback" },
];

interface QueuePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const verdicts = await listVerdicts();
  const resolvedSearch = searchParams ? await searchParams : {};
  const rawFilter = resolvedSearch.filter;
  const activeFilter: FilterValue =
    typeof rawFilter === "string" && ["all", "approve", "decline", "escalate", "feedback"].includes(rawFilter)
      ? (rawFilter as FilterValue)
      : "all";

  const filteredVerdicts = verdicts.filter((v) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "feedback") return false; // feedback is separate concept, show none for now
    return v.decision === activeFilter.toUpperCase();
  });

  return (
    <AppShell>
    <div className="max-w-5xl flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)]">
            Review Queue
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border-strong)]">
            {verdicts.length}
          </span>
        </div>
        <p className="text-sm text-[var(--muted)]">All analyzed transactions, newest first.</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <Link
            key={value}
            href={value === "all" ? "/queue" : `/queue?filter=${value}`}
            className={
              activeFilter === value
                ? "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--accent)]/50 bg-[var(--accent-soft)] text-[var(--accent)]"
                : "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-colors"
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {filteredVerdicts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox size={40} className="text-[var(--border-strong)] mb-3" />
          <p className="text-sm text-[var(--muted)]">
            {activeFilter === "all" ? "No verdicts pending review." : `No ${activeFilter} verdicts.`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          {/* Loading skeleton placeholder — shows during SSR hydration */}
          <div className="hidden">
            <Skeleton className="h-10 w-full" />
          </div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  Transaction ID
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  Decision
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
                  Risk
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden md:table-cell">
                  Model
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden sm:table-cell">
                  Latency
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredVerdicts.map((verdict) => (
                <tr
                  key={verdict.transaction_id}
                  className="hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      <code className="font-mono text-sm text-[var(--muted-strong)] truncate max-w-[240px] inline-block">
                        {verdict.transaction_id}
                      </code>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      <Badge variant={decisionVariant(verdict.decision)}>
                        {verdict.decision}
                      </Badge>
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      {riskPill(verdict.risk_score)}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--muted)] hidden md:table-cell">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      {verdict.model}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--muted)] hidden sm:table-cell">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      {verdict.latency_ms} ms
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[var(--muted)]">
                    <Link href={`/verdicts/${verdict.transaction_id}`} className="block">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </AppShell>
  );
}
