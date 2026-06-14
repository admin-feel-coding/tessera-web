import { listVerdicts, getLatestEval } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/app-shell";

const RISK_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "0.0 – 0.2", min: 0, max: 0.2 },
  { label: "0.2 – 0.4", min: 0.2, max: 0.4 },
  { label: "0.4 – 0.6", min: 0.4, max: 0.6 },
  { label: "0.6 – 0.8", min: 0.6, max: 0.8 },
  { label: "0.8 – 1.0", min: 0.8, max: 1.0 },
];

// Bar color per bucket index: low→green, mid→amber, high→red
const BUCKET_BAR_COLORS = [
  "#10b981", // 0.0–0.2 green
  "#65a30d", // 0.2–0.4 lime
  "#f59e0b", // 0.4–0.6 amber
  "#ea580c", // 0.6–0.8 orange-red
  "#ef4444", // 0.8–1.0 red
];

export default async function AnalyticsPage() {
  const [verdicts, evalData] = await Promise.all([listVerdicts(), getLatestEval()]);
  const total = verdicts.length;

  const approve = verdicts.filter((v) => v.decision === "APPROVE").length;
  const decline = verdicts.filter((v) => v.decision === "DECLINE").length;
  const escalate = verdicts.filter((v) => v.decision === "ESCALATE").length;

  const latencies = verdicts.map((v) => v.latency_ms);
  const avgLatency = total > 0
    ? Math.round(latencies.reduce((sum, l) => sum + l, 0) / latencies.length)
    : 0;
  const minLatency = total > 0 ? Math.min(...latencies) : 0;
  const maxLatency = total > 0 ? Math.max(...latencies) : 0;

  const riskBuckets = RISK_BUCKETS.map((bucket) => ({
    ...bucket,
    count: verdicts.filter(
      (v) => v.risk_score >= bucket.min && v.risk_score < bucket.max
    ).length,
  }));
  const maxBucketCount = Math.max(...riskBuckets.map((b) => b.count), 1);

  const avgToolCalls = total > 0
    ? Math.round(verdicts.reduce((sum, v) => sum + v.tool_calls, 0) / total)
    : 0;

  const escalationBreakdown = verdicts
    .filter(v => v.decision === "ESCALATE" && v.escalation_category)
    .reduce((acc, v) => {
      acc[v.escalation_category!] = (acc[v.escalation_category!] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  const maxEscalationCount = Math.max(...Object.values(escalationBreakdown), 1);

  const grounded = verdicts.filter(
    (v) => v.cited_sources.length > 0
  ).length;

  const verdictsWithCost = verdicts.filter(
    (v) => v.cost_usd != null && v.cost_usd > 0
  );
  const avgCostUsd =
    verdictsWithCost.length > 0
      ? verdictsWithCost.reduce((sum, v) => sum + (v.cost_usd ?? 0), 0) /
        verdictsWithCost.length
      : null;

  function pct(count: number) {
    return `${((count / total) * 100).toFixed(0)}%`;
  }

  const declineMetrics = evalData?.metrics.by_decision["DECLINE"];
  const precisionPct = declineMetrics?.precision != null
    ? `${(declineMetrics.precision * 100).toFixed(1)}%`
    : null;
  const recallPct = declineMetrics?.recall != null
    ? `${(declineMetrics.recall * 100).toFixed(1)}%`
    : null;
  const totalDeclineExpected = declineMetrics?.expected ?? 0;
  const totalDeclineCorrect = declineMetrics?.correct ?? 0;

  const decisionCards = [
    { label: "APPROVE" as const, count: approve, variant: "approve" as const, topColor: "var(--success)" },
    { label: "DECLINE" as const, count: decline, variant: "decline" as const, topColor: "var(--danger)" },
    { label: "ESCALATE" as const, count: escalate, variant: "escalate" as const, topColor: "var(--warning)" },
  ];

  return (
    <AppShell>
    <div className="max-w-6xl flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)]">Analytics</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Live metrics from all analyzed transactions.</p>
      </div>

      {/* Overview */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Overview
        </h2>
        <div className="inline-block">
          <Card>
            <CardContent>
              <p className="text-5xl font-bold text-[var(--foreground)]">{total}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Total verdicts</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Decision distribution */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Decision distribution
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {decisionCards.map(({ label, count, variant, topColor }) => (
            <div
              key={label}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
            >
              <div className="h-1" style={{ backgroundColor: topColor }} />
              <div className="p-6 flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--foreground)]">{count}</p>
                  <p className="text-sm text-[var(--muted)] mt-1">{total > 0 ? pct(count) : "—"}</p>
                </div>
                <Badge variant={variant}>{label}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latency stats */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Latency
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Avg", value: avgLatency },
            { label: "Min", value: minLatency },
            { label: "Max", value: maxLatency },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">{value}</p>
                <p className="text-sm text-[var(--muted)] mt-1">{label} (ms)</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Calibration */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Calibration
        </h2>
        <p className="text-sm text-[var(--muted)] mb-4">Computed from the latest evaluation run on the golden dataset.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Avg cost / verdict */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div
              className="h-1"
              style={{
                backgroundColor:
                  avgCostUsd != null && avgCostUsd > 0.10
                    ? "var(--danger)"
                    : "var(--success)",
              }}
            />
            <div className="p-6">
              <p
                className="text-3xl font-bold"
                style={{
                  color:
                    avgCostUsd != null && avgCostUsd > 0.10
                      ? "var(--danger)"
                      : avgCostUsd != null
                      ? "var(--success)"
                      : "var(--foreground)",
                }}
              >
                {avgCostUsd != null ? `$${avgCostUsd.toFixed(4)}` : "—"}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">Avg cost / verdict</p>
              <p className="text-xs text-[var(--muted)] mt-2">target: &lt; $0.10 per decision</p>
            </div>
          </div>

          {/* Precision (DECLINE) */}
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">{precisionPct ?? "—"}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Precision (DECLINE)</p>
              <p className="text-xs text-[var(--muted)] mt-2">
                {precisionPct
                  ? `${totalDeclineCorrect} of ${Math.round(totalDeclineCorrect / (declineMetrics?.precision ?? 1))} declined were truly fraud`
                  : "run evals to populate"}
              </p>
            </CardContent>
          </Card>

          {/* Recall (DECLINE) */}
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">{recallPct ?? "—"}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Recall (DECLINE)</p>
              <p className="text-xs text-[var(--muted)] mt-2">
                {recallPct
                  ? `${totalDeclineCorrect} of ${totalDeclineExpected} fraud cases were declined`
                  : "run evals to populate"}
              </p>
            </CardContent>
          </Card>

          {/* Pass^k reliability */}
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {evalData?.metrics.pass_at_k != null
                  ? `${(evalData.metrics.pass_at_k * 100).toFixed(1)}%`
                  : "—"}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">
                pass^{evalData?.metrics.pass_k ?? "k"}
              </p>
              <p className="text-xs text-[var(--muted)] mt-2">
                {evalData?.metrics.pass_k
                  ? `all runs correct (k=${evalData.metrics.pass_k})`
                  : "run with --repeats N to compute"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Risk score histogram */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Risk score distribution
        </h2>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-3">
              {riskBuckets.map((bucket, i) => {
                const widthPct = Math.round(
                  (bucket.count / maxBucketCount) * 100
                );
                return (
                  <div key={bucket.label} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--muted)] w-20 shrink-0 font-mono">
                      {bucket.label}
                    </span>
                    <div className="flex-1 bg-[var(--surface-2)] rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: BUCKET_BAR_COLORS[i],
                        }}
                      />
                    </div>
                    <span className="text-sm text-[var(--muted)] w-4 shrink-0 text-right">
                      {bucket.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Escalation category breakdown */}
      {Object.keys(escalationBreakdown).length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
            Escalation reasons
          </h2>
          <Card>
            <CardContent>
              <div className="flex flex-col gap-3">
                {Object.entries(escalationBreakdown).map(([category, count]) => {
                  const widthPct = Math.round((count / maxEscalationCount) * 100);
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-xs text-[var(--muted)] w-48 shrink-0 font-mono uppercase">
                        {category.replace(/_/g, " ")}
                      </span>
                      <div className="flex-1 bg-[var(--surface-2)] rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${widthPct}%`, backgroundColor: "var(--warning)" }}
                        />
                      </div>
                      <span className="text-sm text-[var(--muted)] w-4 shrink-0 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Agent behavior */}
      <section>
        <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Agent behavior
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {avgToolCalls}
              </p>
              <p className="text-sm text-[var(--muted)] mt-1">Avg tool calls</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">{grounded}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Grounded verdicts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-[var(--foreground)]">{escalate}</p>
              <p className="text-sm text-[var(--muted)] mt-1">Escalated</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
    </AppShell>
  );
}
