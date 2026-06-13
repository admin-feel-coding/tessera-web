import { AnalyzeForm } from "./analyze-form";

export default function AnalyzePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">Analyze Transaction</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Submit a transaction for AI fraud analysis.
        </p>
      </div>
      <AnalyzeForm />
    </div>
  );
}
