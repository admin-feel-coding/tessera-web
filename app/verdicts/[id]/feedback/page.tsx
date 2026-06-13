import Link from "next/link";
import { getVerdict } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FeedbackForm } from "./feedback-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FeedbackPage({ params }: Props) {
  const { id } = await params;
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

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <Link
          href={`/verdicts/${id}`}
          className="text-sm text-neutral-500 hover:underline mb-3 inline-block"
        >
          ← Verdict detail
        </Link>
        <h1 className="text-2xl font-semibold">Submit Feedback</h1>
        <p className="text-sm text-neutral-500 mt-1">
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
  );
}
