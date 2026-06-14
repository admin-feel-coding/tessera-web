"use client";

import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRESETS, type Preset } from "@/lib/presets";

const KIND_DOT: Record<string, string> = {
  clean: "bg-[var(--success)]",
  suspicious: "bg-[var(--warning)]",
  fraud: "bg-[var(--danger)]",
};

const VERDICT_VARIANT: Record<string, "approve" | "escalate" | "decline"> = {
  APPROVE: "approve",
  ESCALATE: "escalate",
  DECLINE: "decline",
};

interface ScenarioGalleryProps {
  onSelect: (preset: Preset) => void;
  onRandomize: () => void;
  selectedId?: string;
}

export function ScenarioGallery({ onSelect, onRandomize, selectedId }: ScenarioGalleryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Scenarios</p>
        <Button variant="ghost" size="sm" onClick={onRandomize} className="gap-1.5 text-xs">
          <RefreshCw size={12} />
          Randomize
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className={cn(
              "text-left p-3 rounded-lg border transition-colors",
              "hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]",
              selectedId === preset.id
                ? "border-[var(--accent)]/50 bg-[var(--surface-2)]"
                : "border-[var(--border)] bg-[var(--surface)]"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", KIND_DOT[preset.kind])} />
              <Badge variant={VERDICT_VARIANT[preset.expected_verdict]} className="text-[10px] px-1.5 py-0">
                {preset.expected_verdict}
              </Badge>
            </div>
            <p className="text-xs font-medium text-[var(--foreground)] leading-snug mb-1.5">
              {preset.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {preset.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-[var(--muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded px-1.5 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
