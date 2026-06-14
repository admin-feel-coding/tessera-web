import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/app-shell";
import { getLatestEval } from "@/lib/api";
import { EvalsEmptyState } from "./evals-empty-state";

const DECISIONS = ["APPROVE", "DECLINE", "ESCALATE"] as const;

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export default async function EvalsPage() {
  const evalData = await getLatestEval();

  if (evalData === null) {
    return (
      <AppShell>
        <div className="max-w-5xl flex flex-col gap-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)]">Evals</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Golden dataset evaluation results.</p>
          </div>
          <div className="flex justify-center">
            <EvalsEmptyState />
          </div>
        </div>
      </AppShell>
    );
  }

  const { metrics, run_at } = evalData;
  const passed = metrics.match_rate >= 0.8;
  const confusionMatrix = metrics.confusion_matrix;

  // Compute max count in confusion matrix for tinting
  let maxOffDiagonal = 1;
  if (confusionMatrix) {
    for (const expected of DECISIONS) {
      for (const actual of DECISIONS) {
        if (expected !== actual) {
          maxOffDiagonal = Math.max(maxOffDiagonal, confusionMatrix[expected]?.[actual] ?? 0);
        }
      }
    }
  }

  return (
    <AppShell>
      <div className="max-w-5xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)]">Evals</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Golden dataset evaluation results.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-[var(--muted)]">
              Last run {timeAgo(run_at)}
            </span>
            <Badge variant={passed ? "approve" : "decline"}>
              {passed ? "PASSED" : "FAILED"}
            </Badge>
          </div>
        </div>

        {/* Overview cards */}
        <section>
          <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
            Overview
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.total}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">Total cases</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {pct(metrics.match_rate)}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Match rate ({metrics.correct}/{metrics.total})
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.avg_latency_ms}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">Avg latency (ms)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.p95_latency_ms}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">p95 latency (ms)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.errors}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">Errors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-[var(--foreground)]">
                  {metrics.pass_at_k != null
                    ? `${(metrics.pass_at_k * 100).toFixed(1)}%`
                    : "—"}
                </p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  pass^{metrics.pass_k ?? "k"}
                </p>
                <p className="text-xs text-[var(--muted)] mt-2">
                  {metrics.pass_k
                    ? `all runs correct (k=${metrics.pass_k})`
                    : "run with --repeats N to compute"}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Per-decision breakdown */}
        <section>
          <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
            Per-decision breakdown
          </h2>
          <Card>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6">
                      Decision
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6">
                      Expected
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6">
                      Correct
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6">
                      Precision
                    </th>
                    <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3">
                      Recall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DECISIONS.map((decision) => {
                    const row = metrics.by_decision?.[decision];
                    return (
                      <tr key={decision} className="border-t border-[var(--border)]">
                        <td className="py-3 pr-6">
                          <Badge
                            variant={
                              decision === "APPROVE"
                                ? "approve"
                                : decision === "DECLINE"
                                ? "decline"
                                : "escalate"
                            }
                          >
                            {decision}
                          </Badge>
                        </td>
                        <td className="py-3 pr-6 text-[var(--foreground)]">
                          {row?.expected ?? 0}
                        </td>
                        <td className="py-3 pr-6 text-[var(--foreground)]">
                          {row?.correct ?? 0}
                        </td>
                        <td className="py-3 pr-6 font-medium text-[var(--foreground)]">
                          {row?.precision != null ? pct(row.precision) : "—"}
                        </td>
                        <td className="py-3 font-medium text-[var(--foreground)]">
                          {row?.recall != null ? pct(row.recall) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Confusion matrix */}
        {confusionMatrix && (
          <section>
            <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
              Confusion matrix
            </h2>
            <Card>
              <CardContent>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Rows = expected decision &nbsp;·&nbsp; Columns = actual decision
                </p>
                <div className="overflow-x-auto">
                  <table className="text-sm border-collapse w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6">
                          Expected \ Actual
                        </th>
                        {DECISIONS.map((d) => (
                          <th
                            key={d}
                            className="text-left text-xs font-medium text-[var(--muted)] uppercase tracking-wide pb-3 pr-6 min-w-[80px]"
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DECISIONS.map((expected) => (
                        <tr key={expected} className="border-t border-[var(--border)]">
                          <td className="py-3 pr-6">
                            <Badge
                              variant={
                                expected === "APPROVE"
                                  ? "approve"
                                  : expected === "DECLINE"
                                  ? "decline"
                                  : "escalate"
                              }
                            >
                              {expected}
                            </Badge>
                          </td>
                          {DECISIONS.map((actual) => {
                            const count = confusionMatrix[expected]?.[actual] ?? 0;
                            const isDiagonal = expected === actual;
                            const offDiagonalIntensity =
                              !isDiagonal && maxOffDiagonal > 0
                                ? count / maxOffDiagonal
                                : 0;
                            return (
                              <td
                                key={actual}
                                className="py-3 pr-6 text-center font-mono"
                                style={{
                                  backgroundColor: isDiagonal
                                    ? "var(--success-soft)"
                                    : count > 0
                                    ? `rgba(239,68,68,${(offDiagonalIntensity * 0.3).toFixed(2)})`
                                    : "transparent",
                                  color: isDiagonal ? "var(--success)" : count > 0 ? "var(--danger)" : "var(--muted)",
                                  borderRadius: "4px",
                                }}
                              >
                                {count}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* How to run */}
        <section>
          <h2 className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
            How to run
          </h2>
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent>
                <p className="text-sm text-[var(--muted)] mb-3">
                  Seed fixtures and run the full eval suite:
                </p>
                <pre className="bg-[var(--sidebar-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  {`# Seed eval fixtures (one-time)
cd tessera-data
go run ./scripts/seed_eval

# Run the eval suite
cd tessera-agent
uv run python -m evals`}
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-[var(--muted)] mb-3">
                  pytest integration:
                </p>
                <pre className="bg-[var(--sidebar-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                  {`cd tessera-agent
uv run pytest tests/test_eval_suite.py -v`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
