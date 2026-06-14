"use client";

type SseEvent = { type: string; data: Record<string, unknown> };

const TOOL_ORDER = [
  "get_user_history",
  "get_ip_risk",
  "get_device_fingerprint",
  "check_blacklist",
  "search_similar_cases",
  "check_velocity",
];

function getToolLabel(name: string): string {
  const labels: Record<string, string> = {
    get_user_history: "User history",
    get_ip_risk: "IP risk assessment",
    get_device_fingerprint: "Device fingerprint",
    check_blacklist: "Blacklist check",
    search_similar_cases: "Similar case search",
    check_velocity: "Velocity check",
  };
  return labels[name] ?? name;
}

type ToolStatus = "pending" | "running" | "complete";

interface AgentPanelProps {
  events: SseEvent[];
}

export function AgentPanel({ events }: AgentPanelProps) {
  // Derive tool states from events
  const toolStates: Record<string, ToolStatus> = {};
  const summaries: Record<string, string> = {};
  const durations: Record<string, number> = {};
  let model = "claude-sonnet-4-6";

  for (const ev of events) {
    if (ev.type === "start" && typeof ev.data.model === "string") {
      model = ev.data.model;
    }
    if (ev.type === "tool_start" && typeof ev.data.name === "string") {
      toolStates[ev.data.name] = "running";
    }
    if (ev.type === "tool_complete" && typeof ev.data.name === "string") {
      toolStates[ev.data.name] = "complete";
      if (typeof ev.data.summary === "string") {
        summaries[ev.data.name] = ev.data.summary;
      }
      if (typeof ev.data.duration_ms === "number") {
        durations[ev.data.name] = ev.data.duration_ms;
      }
    }
  }

  const isVerdict = events.some((e) => e.type === "verdict");
  const allToolsComplete =
    TOOL_ORDER.every((name) => toolStates[name] === "complete") &&
    TOOL_ORDER.some((name) => toolStates[name] === "complete");
  const isSynthesizing = allToolsComplete && !isVerdict;
  const headerLabel = isVerdict ? "Analysis complete" : "Agent running";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center gap-2.5">
        <span
          className={`w-[7px] h-[7px] rounded-full shrink-0 ${
            isVerdict
              ? "bg-[var(--success)]"
              : "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse"
          }`}
        />
        <span className="text-xs font-semibold text-[var(--muted-strong)]">
          {headerLabel}
        </span>
        <span className="ml-auto text-[10px] text-[var(--muted)] font-mono">
          {model}
        </span>
      </div>

      {/* Subheader */}
      <div className="px-5 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <p className="text-[11px] text-[var(--muted)]">
          Calling 6 data tools: user history, IP signals, device fingerprint, blacklist check, similar cases, and velocity check.
        </p>
      </div>

      {/* Tool list */}
      <div className="px-5 py-2">
        {TOOL_ORDER.map((name) => {
          const status: ToolStatus = toolStates[name] ?? "pending";
          return (
            <div
              key={name}
              className="flex items-start gap-2.5 py-2.5 border-b border-[var(--border)] last:border-0"
            >
              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {status === "complete" && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--success-soft)] text-[var(--success)] text-[9px] font-bold">
                    ✓
                  </span>
                )}
                {status === "running" && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-[9px] animate-pulse">
                    ●
                  </span>
                )}
                {status === "pending" && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full border border-[var(--border-strong)] text-[var(--muted)] text-[9px]">
                    ○
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-mono font-medium mb-0.5 ${
                    status === "complete"
                      ? "text-[var(--muted-strong)]"
                      : status === "running"
                      ? "text-[var(--accent)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {getToolLabel(name)}
                </p>
                {status === "pending" && (
                  <p className="text-[11px] text-[var(--muted)] opacity-50">queued</p>
                )}
                {status === "running" && (
                  <p className="text-[11px] text-[var(--muted)]">fetching...</p>
                )}
                {status === "complete" && summaries[name] && (
                  <p className="text-[11px] text-[var(--muted)]">{summaries[name]}</p>
                )}
                {status === "complete" && durations[name] !== undefined && (
                  <p className="text-[10px] text-[var(--border-strong)] font-mono mt-0.5">
                    {durations[name]}ms
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Synthesizing row — visible after all tools complete until verdict arrives */}
        {isSynthesizing && (
          <div className="flex items-start gap-2.5 py-2.5 border-t border-[var(--border)]">
            <div className="mt-0.5 shrink-0">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] text-[9px] animate-pulse">
                ●
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono font-medium mb-0.5 text-[var(--warning)]">
                Synthesizing verdict
              </p>
              <p className="text-[11px] text-[var(--muted)]">
                Claude is writing the final analysis...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
