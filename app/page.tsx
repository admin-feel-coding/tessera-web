import Link from "next/link";
import { listVerdicts } from "@/lib/api";
import type { Verdict } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function decisionVariant(
  decision: Verdict["decision"]
): "approve" | "decline" | "escalate" {
  if (decision === "APPROVE") return "approve";
  if (decision === "DECLINE") return "decline";
  return "escalate";
}

export default async function QueuePage() {
  const verdicts = await listVerdicts();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Review Queue</h1>
        <Badge variant="default">{verdicts.length}</Badge>
      </div>

      {verdicts.length === 0 ? (
        <p className="text-gray-500">No verdicts pending review.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {verdicts.map((verdict) => (
            <li key={verdict.transaction_id}>
              <Link href={`/verdicts/${verdict.transaction_id}`}>
                <Card className="hover:border-neutral-400 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <code className="text-sm font-mono text-neutral-700 truncate max-w-[180px]">
                        {verdict.transaction_id}
                      </code>
                      <Badge variant={decisionVariant(verdict.decision)}>
                        {verdict.decision}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>{Math.round(verdict.risk_score * 100)}%</span>
                      <span className="text-neutral-400 hidden sm:inline">
                        {verdict.model}
                      </span>
                      <span>{verdict.latency_ms} ms</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
