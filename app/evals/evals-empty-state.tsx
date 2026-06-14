"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const CMD = "cd tessera-agent && uv run python -m evals";

export function EvalsEmptyState() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="w-full max-w-lg">
      <CardContent className="flex flex-col gap-4 py-10 items-center text-center">
        <p className="text-lg font-semibold text-[var(--foreground)]">
          No eval runs yet
        </p>
        <p className="text-sm text-[var(--muted)]">
          Run the eval suite to populate this page.
        </p>
        <div className="w-full relative">
          <pre className="w-full text-left bg-[var(--sidebar-bg)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed pr-20">
            <code>{CMD}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-1 rounded border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {copied ? "copied!" : "copy"}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)]">
          Results are saved to{" "}
          <code className="font-mono">evals/results/latest.json</code> and
          served live.
        </p>
      </CardContent>
    </Card>
  );
}
