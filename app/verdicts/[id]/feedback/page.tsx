import Link from "next/link";
import { getVerdict } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FeedbackForm } from "./feedback-form";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params;
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
            Queue
          </Link>
          <p className="text-[var(--muted)]">Verdict not found.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href={`/verdicts/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Verdict detail
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Submit Feedback</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          <code className="font-mono">{verdict.transaction_id}</code>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyst Review</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm verdict={verdict} />
        </CardContent>
      </Card>
    </div>
    </AppShell>
  );
}
