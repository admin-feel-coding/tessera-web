import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CASE_BREAKDOWN = [
  {
    decision: "DECLINE",
    cases: 15,
    signals: "Blacklist hit (user_id / email / card_bin)",
  },
  {
    decision: "ESCALATE",
    cases: 20,
    signals: "≥ 2 risk flags (velocity + IP risk, IP risk + device, velocity + device)",
  },
  {
    decision: "APPROVE",
    cases: 15,
    signals: "No signals or < 2 flags",
  },
] as const;

const PER_DECISION_ACCURACY = [
  { decision: "APPROVE", expected: 15, correct: 15, accuracy: "100%" },
  { decision: "DECLINE", expected: 15, correct: 15, accuracy: "100%" },
  { decision: "ESCALATE", expected: 20, correct: 19, accuracy: "95%" },
] as const;

const METRICS = [
  "Match rate (decision accuracy vs. expected)",
  "Average and p95 latency per verdict",
  "Per-decision breakdown (APPROVE / DECLINE / ESCALATE accuracy)",
  "Error count (cases where analyze() threw an exception)",
];

export default function EvalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Evals</h1>

      {/* Overview */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent>
              <p className="text-5xl font-bold text-neutral-900">50</p>
              <p className="text-sm text-neutral-500 mt-1">Total eval cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-5xl font-bold text-neutral-900">≥ 80%</p>
              <p className="text-sm text-neutral-500 mt-1">Match rate target</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-5xl font-bold text-neutral-900">&lt; 5s</p>
              <p className="text-sm text-neutral-500 mt-1">Latency target</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Case breakdown */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Case breakdown
        </h2>
        <Card>
          <CardContent>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3 pr-6">
                    Decision
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3 pr-6">
                    Cases
                  </th>
                  <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3">
                    Trigger signals
                  </th>
                </tr>
              </thead>
              <tbody>
                {CASE_BREAKDOWN.map(({ decision, cases, signals }) => (
                  <tr key={decision} className="border-t border-neutral-100">
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
                    <td className="py-3 pr-6 font-medium text-neutral-900">
                      {cases}
                    </td>
                    <td className="py-3 text-neutral-600">{signals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Sample run result */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Sample run result
        </h2>
        <div className="flex flex-col gap-4">
          {/* Run-level stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold text-neutral-900">98%</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Match rate (49/50)
                  </p>
                </div>
                <Badge variant="approve">PASSED</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-neutral-900">312</p>
                <p className="text-sm text-neutral-500 mt-1">Avg latency (ms)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-neutral-900">489</p>
                <p className="text-sm text-neutral-500 mt-1">p95 latency (ms)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-3xl font-bold text-neutral-900">0</p>
                <p className="text-sm text-neutral-500 mt-1">Errors</p>
              </CardContent>
            </Card>
          </div>

          {/* Per-decision accuracy */}
          <Card>
            <CardContent>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3 pr-6">
                      Decision
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3 pr-6">
                      Expected
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3 pr-6">
                      Correct
                    </th>
                    <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wide pb-3">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PER_DECISION_ACCURACY.map(
                    ({ decision, expected, correct, accuracy }) => (
                      <tr key={decision} className="border-t border-neutral-100">
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
                        <td className="py-3 pr-6 text-neutral-900">
                          {expected}
                        </td>
                        <td className="py-3 pr-6 text-neutral-900">{correct}</td>
                        <td className="py-3 font-medium text-neutral-900">
                          {accuracy}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How to run */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          How to run
        </h2>
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent>
              <p className="text-sm text-neutral-500 mb-3">
                Seed fixtures and run the full eval suite:
              </p>
              <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
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
              <p className="text-sm text-neutral-500 mb-3">
                pytest integration:
              </p>
              <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                {`cd tessera-agent
uv run pytest tests/test_eval_suite.py -v`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Metrics tracked */}
      <section>
        <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
          Metrics tracked
        </h2>
        <Card>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {METRICS.map((metric) => (
                <li key={metric} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                  {metric}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
