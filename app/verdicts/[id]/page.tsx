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

const LANGFUSE_HOST =
  process.env.NEXT_PUBLIC_LANGFUSE_HOST ?? "https://cloud.langfuse.com";

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

const SIGNAL_LABELS: Record<keyof Verdict["signals"], string> = {
  user_history_flag: "User History",
  ip_risk_flag: "IP Risk",
  device_fingerprint_flag: "Device Fingerprint",
  blacklist_hit: "Blacklist Hit",
  velocity_flag: "Velocity",
};

export default async function VerdictDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearch = await searchParams;
  const feedbackSubmitted = resolvedSearch.feedback === "submitted";

  const verdict = await getVerdict(id);

  if (!verdict) {
    return (
      <div>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:underline mb-4 inline-block"
        >
          ← Queue
        </Link>
        <p className="text-gray-500">Verdict not found.</p>
      </div>
    );
  }

  const signalEntries = Object.entries(verdict.signals) as [
    keyof Verdict["signals"],
    boolean,
  ][];

  const hasNoCitedSources = verdict.cited_sources.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Feedback submitted banner */}
      {feedbackSubmitted && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
          Feedback submitted.
        </div>
      )}

      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:underline mb-3 inline-block"
        >
          ← Queue
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <code className="text-lg font-mono font-semibold">
            {verdict.transaction_id}
          </code>
          <Badge variant={decisionVariant(verdict.decision)}>
            {verdict.decision}
          </Badge>
          <span className="text-sm text-neutral-500">
            Risk: {Math.round(verdict.risk_score * 100)}%
          </span>
        </div>
      </div>

      {/* Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Reasoning</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {verdict.reasoning}
          </p>
        </CardContent>
      </Card>

      {/* Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {signalEntries.map(([key, flagged]) => (
              <div key={key} className="flex flex-col gap-1">
                <dt className="text-xs text-neutral-500">
                  {SIGNAL_LABELS[key]}
                </dt>
                <dd>
                  <Badge variant={flagged ? "flag" : "ok"}>
                    {flagged ? "Flag" : "OK"}
                  </Badge>
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Cited Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Cited Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {hasNoCitedSources && verdict.decision === "ESCALATE" ? (
            <p className="text-sm text-neutral-500">
              No sources cited — escalated for review.
            </p>
          ) : hasNoCitedSources ? (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              ⚠ No cited sources — this verdict may violate the grounding
              contract.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {verdict.cited_sources.map((source, index) => (
                <li
                  key={index}
                  className="border rounded-md px-4 py-3 bg-neutral-50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default">{source.type}</Badge>
                    <code className="text-xs font-mono text-neutral-700">
                      {source.id}
                    </code>
                  </div>
                  <p className="text-sm text-neutral-600">{source.excerpt}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Escalation Reason — only when present */}
      {verdict.escalation_reason !== null && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Escalation Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700">{verdict.escalation_reason}</p>
          </CardContent>
        </Card>
      )}

      {/* Footer / Metadata */}
      <Card>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-neutral-500">Model</dt>
              <dd className="font-mono text-neutral-700">{verdict.model}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Tool calls</dt>
              <dd className="text-neutral-700">{verdict.tool_calls}</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Latency</dt>
              <dd className="text-neutral-700">{verdict.latency_ms} ms</dd>
            </div>
            <div>
              <dt className="text-xs text-neutral-500">Trace ID</dt>
              <dd className="font-mono text-neutral-700 truncate">
                {verdict.langfuse_trace_id ? (
                  <a
                    href={`${LANGFUSE_HOST}/trace/${verdict.langfuse_trace_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {verdict.langfuse_trace_id}
                  </a>
                ) : (
                  "trace not yet available"
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-4 pt-4 border-t">
            <Link
              href={`/verdicts/${verdict.transaction_id}/feedback`}
              className="text-sm text-neutral-700 hover:underline font-medium"
            >
              Submit feedback →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
