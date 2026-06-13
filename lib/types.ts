export type Decision = "APPROVE" | "DECLINE" | "ESCALATE";
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
  latency_ms: number;
  model: string;
  tool_calls: number;
  langfuse_trace_id: string;
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
