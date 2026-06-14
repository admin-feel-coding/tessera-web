import Link from "next/link";
import { getVerdict } from "@/lib/api";
import type { Verdict } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, CheckCircle2, Shield, Wifi, Fingerprint, Ban, Gauge } from "lucide-react";
import { AppShell } from "@/components/app-shell";

const LANGFUSE_HOST =
  process.env.NEXT_PUBLIC_LANGFUSE_HOST ?? "https://cloud.langfuse.com";

// Render inline **bold** markers without a markdown library.
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-[var(--foreground)]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Split "Step 1 — Label: body. Step 2 —..." into structured items.
// Falls back to rendering the raw text as a single paragraph.
function ReasoningSteps({ text }: { text: string }) {
  const stepRe = /Step\s+(\d+)\s*[—–-]+\s*([^:]+):\s*/g;
  const matches = [...text.matchAll(stepRe)];

  if (matches.length === 0) {
    return (
      <p className="text-[15px] text-[var(--muted)] leading-7 whitespace-pre-line">
        <InlineText text={text} />
      </p>
    );
  }

  const steps: { num: string; label: string; body: string }[] = matches.map(
    (m, i) => {
      const start = (m.index ?? 0) + m[0].length;
      const end =
        i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
      return { num: m[1], label: m[2].trim(), body: text.slice(start, end).trim() };
    }
  );

  return (
    <ol className="space-y-5">
      {steps.map((s) => (
        <li key={s.num} className="flex gap-4">
          <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[var(--surface-2)] border border-[var(--border-strong)] flex items-center justify-center text-[11px] font-mono font-semibold text-[var(--muted-strong)]">
            {s.num}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)] mb-1">
              {s.label}
            </p>
            <p className="text-[15px] text-[var(--muted)] leading-7">
              <InlineText text={s.body} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function decisionVariant(
  decision: Verdict["decision"]
): "approve" | "decline" | "escalate" {
  if (decision === "APPROVE") return "approve";
  if (decision === "DECLINE") return "decline";
  return "escalate";
}

function riskColor(score: number): string {
  const pct = Math.round(score * 100);
  if (pct < 40) return "var(--success)";
  if (pct < 70) return "var(--warning)";
  return "var(--danger)";
}

const SIGNAL_META: Record<
  keyof Verdict["signals"],
  { label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }
> = {
  user_history_flag: { label: "User History", Icon: Shield },
  ip_risk_flag: { label: "IP Risk", Icon: Wifi },
  device_fingerprint_flag: { label: "Device Fingerprint", Icon: Fingerprint },
  blacklist_hit: { label: "Blacklist Hit", Icon: Ban },
  velocity_flag: { label: "Velocity", Icon: Gauge },
};

const SOURCE_BORDER: Record<string, string> = {
  rule: "border-l-[var(--accent)]",
  case: "border-l-[var(--warning)]",
};

export default async function VerdictDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const feedbackSubmitted = resolvedSearch.feedback === "submitted";
  const feedbackCaseId =
    typeof resolvedSearch.case_id === "string" ? resolvedSearch.case_id : undefined;

  const verdict = await getVerdict(id);

  if (!verdict) {
    return (
      <AppShell>
        <div>
          <Link
            href="/queue"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Back to Queue
          </Link>
          <p className="text-[var(--muted)]">Verdict not found.</p>
        </div>
      </AppShell>
    );
  }

  const signalEntries = Object.entries(verdict.signals) as [
    keyof Verdict["signals"],
    boolean,
  ][];

  const hasNoCitedSources = verdict.cited_sources.length === 0;
  const riskPct = Math.round(verdict.risk_score * 100);

  return (
    <AppShell>
    <div className="flex flex-col gap-7">
      {/* Feedback submitted banner */}
      {feedbackSubmitted && (
        <Card className="bg-[var(--success-soft)] border-[var(--success)]/20 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 size={15} className="text-[var(--success)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--success)]">Feedback recorded</p>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                {feedbackCaseId ? (
                  <>Case <code className="font-mono">{feedbackCaseId}</code> indexed in the RAG corpus. The agent will consider this case for similar transactions.</>
                ) : (
                  "Case indexed in the RAG corpus. The agent will consider this case for similar transactions."
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Back link */}
      <div>
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Queue
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)] font-mono">
          {verdict.transaction_id}
        </h1>
        <Badge variant={decisionVariant(verdict.decision)}>
          {verdict.decision}
        </Badge>
      </div>

      {/* Stat strip */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="flex divide-x divide-[var(--border)]">
          <div className="flex-1 px-6 py-4 text-center">
            <p
              className="text-2xl font-bold font-mono"
              style={{ color: riskColor(verdict.risk_score) }}
            >
              {riskPct}%
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">Risk score</p>
          </div>
          <div className="flex-1 px-6 py-4 text-center">
            <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
              {verdict.latency_ms}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">Latency (ms)</p>
          </div>
          <div className="flex-1 px-6 py-4 text-center">
            <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
              {verdict.cost_usd != null && verdict.cost_usd > 0
                ? `$${verdict.cost_usd.toFixed(4)}`
                : "—"}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">Cost (USD)</p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <ReasoningSteps text={verdict.reasoning} />
        </CardContent>
      </Card>

      {/* Signals + cited sources in a 2-col grid on large screens */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Signals */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {signalEntries.map(([key, flagged]) => {
                const { label, Icon } = SIGNAL_META[key];
                return (
                  <div
                    key={key}
                    className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border text-sm font-medium"
                    style={{
                      backgroundColor: flagged ? "var(--danger-soft)" : "var(--surface-2)",
                      borderColor: flagged ? "rgba(239,68,68,0.3)" : "var(--border-strong)",
                      color: flagged ? "var(--danger)" : "var(--muted)",
                    }}
                  >
                    <Icon size={14} strokeWidth={2} />
                    <span className="flex-1">{label}</span>
                    <Badge variant={flagged ? "flag" : "ok"}>
                      {flagged ? "Flag" : "OK"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Cited Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Cited Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {hasNoCitedSources && verdict.decision === "ESCALATE" ? (
              <p className="text-sm text-[var(--muted)]">
                No sources cited — escalated for review.
              </p>
            ) : hasNoCitedSources ? (
              <div className="flex items-center gap-2 text-sm text-[var(--warning)] bg-[var(--warning-soft)] border border-[var(--warning)]/30 rounded-lg px-3 py-2">
                <AlertTriangle size={14} />
                No cited sources — this verdict may violate the grounding contract.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {verdict.cited_sources.map((source, index) => (
                  <li
                    key={index}
                    className={`border border-l-4 rounded-lg px-5 py-4 bg-[var(--surface-2)] ${SOURCE_BORDER[source.type] ?? "border-l-[var(--border-strong)]"}`}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <Badge variant="default">{source.type}</Badge>
                      <code className="text-sm font-mono text-[var(--muted)]">
                        {source.id}
                      </code>
                    </div>
                    <p className="text-[15px] text-[var(--foreground)] leading-relaxed">{source.excerpt}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Escalation Reason */}
      {verdict.escalation_reason !== null && (
        <div className="flex items-start gap-3 border border-[var(--warning)]/30 bg-[var(--warning-soft)] rounded-xl px-4 py-4">
          <AlertTriangle size={16} className="text-[var(--warning)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--warning)] mb-1">Escalation Reason</p>
            {verdict.escalation_category != null && (() => {
              const categoryColors: Record<string, string> = {
                CONFLICTING_SIGNALS:    "text-[var(--warning)] bg-[var(--warning-soft)]",
                INSUFFICIENT_GROUNDING: "text-[var(--danger)] bg-[var(--danger-soft)]",
                LOW_CONFIDENCE:         "text-[var(--warning)] bg-[var(--warning-soft)]",
                NOVEL_PATTERN:          "text-[var(--accent)] bg-[var(--accent-soft)]",
                POLICY_REQUIRED:        "text-[var(--muted-strong)] bg-[var(--surface-2)]",
              };
              return (
                <Badge variant="default" className={`mb-2 ${categoryColors[verdict.escalation_category!] ?? ""}`}>
                  {verdict.escalation_category!.replace(/_/g, " ")}
                </Badge>
              );
            })()}
            <p className="text-sm text-[var(--warning)]">{verdict.escalation_reason}</p>
          </div>
        </div>
      )}

      {/* Footer / Metadata */}
      <Card>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-[var(--muted)] mb-1">Model</dt>
              <dd className="text-xs font-mono text-[var(--muted)]">{verdict.model}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)] mb-1">Tool calls</dt>
              <dd className="text-xs font-mono text-[var(--muted)]">{verdict.tool_calls}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)] mb-1">Latency</dt>
              <dd className="text-xs font-mono text-[var(--muted)]">{verdict.latency_ms} ms</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--muted)] mb-1">Trace ID</dt>
              <dd className="font-mono text-xs truncate">
                {verdict.langfuse_trace_id ? (
                  <a
                    href={`${LANGFUSE_HOST}/trace/${verdict.langfuse_trace_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    {verdict.langfuse_trace_id}
                  </a>
                ) : (
                  <span className="text-[var(--muted)]">not available</span>
                )}
              </dd>
            </div>
            {verdict.cost_usd != null && verdict.cost_usd > 0 && (
              <div className="col-span-2 sm:col-span-4">
                <dt className="text-xs text-[var(--muted)] mb-1">Cost</dt>
                <dd>
                  <span className="text-xs font-mono text-[var(--muted)]">
                    ${verdict.cost_usd.toFixed(4)} · {verdict.input_tokens?.toLocaleString()} in / {verdict.output_tokens?.toLocaleString()} out tokens
                  </span>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center">
            <Link
              href={`/verdicts/${verdict.transaction_id}/feedback`}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)]/50"
            >
              Submit Feedback
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </AppShell>
  );
}
