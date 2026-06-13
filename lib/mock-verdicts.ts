import type { Verdict } from "./types";

export const MOCK_VERDICTS: Verdict[] = [
  {
    transaction_id: "txn_a1b2c3",
    decision: "APPROVE",
    risk_score: 0.08,
    reasoning:
      "User has 47 previous transactions with consistent patterns. IP address is clean (score 0.12). Device fingerprint normal (1 user). No blacklist matches. Low risk across all signals.",
    cited_sources: [
      {
        type: "rule",
        id: "NO_RISK_FLAGS",
        excerpt: "No risk signals detected across all checks.",
      },
    ],
    signals: {
      user_history_flag: false,
      ip_risk_flag: false,
      device_fingerprint_flag: false,
      blacklist_hit: false,
      velocity_flag: false,
    },
    escalation_reason: null,
    latency_ms: 1240,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
  {
    transaction_id: "txn_d4e5f6",
    decision: "APPROVE",
    risk_score: 0.15,
    reasoning:
      "Transaction from established user with 23 past purchases. IP from US with no VPN flag. Device seen before with single user. Email not on blacklist.",
    cited_sources: [
      {
        type: "rule",
        id: "NO_RISK_FLAGS",
        excerpt: "No risk signals detected across all checks.",
      },
    ],
    signals: {
      user_history_flag: false,
      ip_risk_flag: false,
      device_fingerprint_flag: false,
      blacklist_hit: false,
      velocity_flag: false,
    },
    escalation_reason: null,
    latency_ms: 980,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
  {
    transaction_id: "txn_g7h8i9",
    decision: "DECLINE",
    risk_score: 0.95,
    reasoning:
      "User ID user_002 is on the fraud blacklist (reason: confirmed fraud ring member). Transaction declined automatically per blacklist policy.",
    cited_sources: [
      {
        type: "rule",
        id: "BLACKLIST_HIT",
        excerpt: "Entity matched fraud blacklist.",
      },
    ],
    signals: {
      user_history_flag: false,
      ip_risk_flag: false,
      device_fingerprint_flag: false,
      blacklist_hit: true,
      velocity_flag: false,
    },
    escalation_reason: null,
    latency_ms: 640,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
  {
    transaction_id: "txn_j1k2l3",
    decision: "DECLINE",
    risk_score: 0.92,
    reasoning:
      "Card BIN 999999 is on the fraud blacklist (reason: stolen card batch). Transaction declined.",
    cited_sources: [
      {
        type: "rule",
        id: "BLACKLIST_HIT",
        excerpt: "Entity matched fraud blacklist.",
      },
    ],
    signals: {
      user_history_flag: false,
      ip_risk_flag: false,
      device_fingerprint_flag: false,
      blacklist_hit: true,
      velocity_flag: false,
    },
    escalation_reason: null,
    latency_ms: 712,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
  {
    transaction_id: "txn_m4n5o6",
    decision: "ESCALATE",
    risk_score: 0.65,
    reasoning:
      "Multiple risk signals present: IP address flagged as high-risk proxy (score 0.82), device fingerprint shared across 7 accounts (suspicious=true). Escalating for human review.",
    cited_sources: [
      {
        type: "rule",
        id: "MULTI_SIGNAL_RISK",
        excerpt:
          "Multiple risk signals present; escalating for human review.",
      },
    ],
    signals: {
      user_history_flag: false,
      ip_risk_flag: true,
      device_fingerprint_flag: true,
      blacklist_hit: false,
      velocity_flag: false,
    },
    escalation_reason:
      "Multiple high-confidence risk signals require analyst review before proceeding.",
    latency_ms: 1850,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
  {
    transaction_id: "txn_p7q8r9",
    decision: "ESCALATE",
    risk_score: 0.6,
    reasoning:
      "No risk signals detected but transaction amount ($4,200.00) is unusually high for this merchant category. No cited source could confirm safety.",
    cited_sources: [],
    signals: {
      user_history_flag: false,
      ip_risk_flag: false,
      device_fingerprint_flag: false,
      blacklist_hit: false,
      velocity_flag: false,
    },
    escalation_reason:
      "No grounded source could be identified to support a verdict.",
    latency_ms: 2100,
    model: "mock-runner-v1",
    tool_calls: 4,
    langfuse_trace_id: "",
  },
];

export function getVerdictById(id: string): Verdict | undefined {
  return MOCK_VERDICTS.find((v) => v.transaction_id === id);
}
