export type Decision = "APPROVE" | "DECLINE" | "ESCALATE";

export type EscalationCategory =
  | "CONFLICTING_SIGNALS"
  | "INSUFFICIENT_GROUNDING"
  | "LOW_CONFIDENCE"
  | "NOVEL_PATTERN"
  | "POLICY_REQUIRED";
export type SourceType = "rule" | "case";

export interface CitedSource {
  type: SourceType;
  id: string;
  excerpt: string;
}

export interface Signals {
  user_history_flag: boolean;
  ip_risk_flag: boolean;
  device_fingerprint_flag: boolean;
  blacklist_hit: boolean;
  velocity_flag: boolean;
}

export interface Verdict {
  transaction_id: string;
  decision: Decision;
  risk_score: number;
  reasoning: string;
  cited_sources: CitedSource[];
  signals: Signals;
  escalation_reason: string | null;
  escalation_category?: EscalationCategory | null;
  latency_ms: number;
  model: string;
  tool_calls: number;
  langfuse_trace_id: string;
  input_tokens?: number;
  output_tokens?: number;
  cost_usd?: number;
}

export interface Transaction {
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  merchant_category: string;
  ip_address: string;
  device_id: string;
  card_bin: string;
  email: string;
}

export interface FeedbackPayload {
  transaction_id: string;
  corrected_decision: Decision;
  analyst_note: string;
  decisive_signals: string[];
  original_verdict: Verdict;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export interface EvalDecisionMetrics {
  expected: number;
  correct: number;
  precision?: number;
  recall?: number;
}

export interface EvalSummary {
  run_at: string;
  metrics: {
    total: number;
    correct: number;
    match_rate: number;
    avg_latency_ms: number;
    p95_latency_ms: number;
    errors: number;
    by_decision: Record<string, EvalDecisionMetrics>;
    confusion_matrix?: Record<string, Record<string, number>>;
    pass_at_1?: number;
    pass_at_k?: number;
    pass_k?: number;
  };
}
