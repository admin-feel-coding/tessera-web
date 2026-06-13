import { listVerdicts } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const RISK_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "0.0 – 0.2", min: 0, max: 0.2 },
  { label: "0.2 – 0.4", min: 0.2, max: 0.4 },
  { label: "0.4 – 0.6", min: 0.4, max: 0.6 },
  { label: "0.6 – 0.8", min: 0.6, max: 0.8 },
  { label: "0.8 – 1.0", min: 0.8, max: 1.0 },
];

export default async function AnalyticsPage() {
  const verdicts = await listVerdicts();
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

  const grounded = verdicts.filter(
    (v) => v.cited_sources.length > 0
  ).length;

  function pct(count: number) {
    return `${((count / total) * 100).toFixed(0)}%`;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      {/* Total verdicts */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Overview
        </h2>
        <Card className="inline-block">
          <CardContent>
            <p className="text-5xl font-bold text-neutral-900">{total}</p>
            <p className="text-sm text-neutral-500 mt-1">Total verdicts</p>
          </CardContent>
        </Card>
      </section>

      {/* Decision distribution */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Decision distribution
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(
            [
              { label: "APPROVE", count: approve, variant: "approve" },
              { label: "DECLINE", count: decline, variant: "decline" },
              { label: "ESCALATE", count: escalate, variant: "escalate" },
            ] as const
          ).map(({ label, count, variant }) => (
            <Card key={label}>
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">{count}</p>
                  <p className="text-sm text-neutral-500 mt-1">{pct(count)}</p>
                </div>
                <Badge variant={variant}>{label}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latency stats */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
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
                <p className="text-3xl font-bold text-neutral-900">{value}</p>
                <p className="text-sm text-neutral-500 mt-1">{label} (ms)</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Risk score histogram */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Risk score distribution
        </h2>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-3">
              {riskBuckets.map((bucket) => {
                const widthPct = Math.round(
                  (bucket.count / maxBucketCount) * 100
                );
                return (
                  <div key={bucket.label} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500 w-20 shrink-0 font-mono">
                      {bucket.label}
                    </span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-neutral-700 rounded-full transition-all"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="text-sm text-neutral-700 w-4 shrink-0 text-right">
                      {bucket.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tool calls + Grounded vs Escalated */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Agent behavior
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900">
                {avgToolCalls}
              </p>
              <p className="text-sm text-neutral-500 mt-1">Avg tool calls</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900">{grounded}</p>
              <p className="text-sm text-neutral-500 mt-1">
                Grounded verdicts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-3xl font-bold text-neutral-900">{escalate}</p>
              <p className="text-sm text-neutral-500 mt-1">Escalated</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
