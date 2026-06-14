import type { Transaction } from "./types";

export type PresetKind = "clean" | "suspicious" | "fraud";
export type ExpectedVerdict = "APPROVE" | "ESCALATE" | "DECLINE";

export type Preset = {
  id: string;
  label: string;
  description: string;
  kind: PresetKind;
  expected_verdict: ExpectedVerdict;
  tags: string[];
  transaction: Transaction;
};

export const PRESETS: Preset[] = [
  {
    id: "clean-recurring",
    label: "Recurring purchase",
    description: "Known user, same merchant as last month, typical amount.",
    kind: "clean",
    expected_verdict: "APPROVE",
    tags: ["known-user", "recurring", "low-amount"],
    transaction: {
      transaction_id: "txn_demo_clean_001",
      user_id: "user_001",
      amount: 49.99,
      currency: "USD",
      merchant_category: "groceries",
      ip_address: "192.168.1.1",
      device_id: "dev_001",
      card_bin: "411111",
      email: "alice@gmail.com",
    },
  },
  {
    id: "clean-new-user-small",
    label: "First-time small purchase",
    description: "Brand-new account, $24 coffee purchase, no risk signals.",
    kind: "clean",
    expected_verdict: "APPROVE",
    tags: ["new-account", "low-amount"],
    transaction: {
      transaction_id: "txn_demo_clean_002",
      user_id: "user_new_001",
      amount: 24.0,
      currency: "USD",
      merchant_category: "restaurant",
      ip_address: "24.185.42.77",
      device_id: "dev_002",
      card_bin: "401288",
      email: "carol.jones@outlook.com",
    },
  },
  {
    id: "suspicious-high-amount",
    label: "Unusual high amount",
    description: "User's historical average is $80 — this is $2,499 electronics.",
    kind: "suspicious",
    expected_verdict: "ESCALATE",
    tags: ["high-amount", "amount-spike"],
    transaction: {
      transaction_id: "txn_demo_susp_001",
      user_id: "user_002",
      amount: 2499.0,
      currency: "USD",
      merchant_category: "electronics",
      ip_address: "24.91.55.210",
      device_id: "dev_003",
      card_bin: "524432",
      email: "bob@gmail.com",
    },
  },
  {
    id: "suspicious-vpn",
    label: "VPN + new device",
    description: "Tor exit node IP, brand-new device fingerprint never seen before.",
    kind: "suspicious",
    expected_verdict: "ESCALATE",
    tags: ["VPN", "tor", "new-device"],
    transaction: {
      transaction_id: "txn_demo_susp_002",
      user_id: "user_002",
      amount: 399.0,
      currency: "USD",
      merchant_category: "electronics",
      ip_address: "185.220.101.45",
      device_id: "dev_new_999",
      card_bin: "524432",
      email: "bob@protonmail.com",
    },
  },
  {
    id: "suspicious-velocity",
    label: "Cross-user velocity",
    description: "Same IP used by 5 distinct users in the last 60 minutes.",
    kind: "suspicious",
    expected_verdict: "ESCALATE",
    tags: ["velocity", "shared-IP", "card-testing"],
    transaction: {
      transaction_id: "txn_demo_susp_003",
      user_id: "user_004",
      amount: 149.99,
      currency: "USD",
      merchant_category: "clothing",
      ip_address: "185.220.101.47",
      device_id: "dev_004",
      card_bin: "552600",
      email: "dave@yahoo.com",
    },
  },
  {
    id: "fraud-blacklist-bin",
    label: "Blacklisted card BIN",
    description: "Card BIN 424242 is on the active blacklist.",
    kind: "fraud",
    expected_verdict: "DECLINE",
    tags: ["blacklist", "BIN-flagged"],
    transaction: {
      transaction_id: "txn_demo_fraud_001",
      user_id: "user_003",
      amount: 999.99,
      currency: "USD",
      merchant_category: "jewelry",
      ip_address: "185.220.101.47",
      device_id: "dev_003",
      card_bin: "424242",
      email: "fraud@tempmail.com",
    },
  },
  {
    id: "fraud-card-testing",
    label: "Card-testing pattern",
    description: "Tiny amount, disposable email, BIN with 8+ distinct users on same IP.",
    kind: "fraud",
    expected_verdict: "DECLINE",
    tags: ["card-testing", "tempmail", "high-velocity"],
    transaction: {
      transaction_id: "txn_demo_fraud_002",
      user_id: "user_new_002",
      amount: 1.0,
      currency: "USD",
      merchant_category: "streaming",
      ip_address: "185.220.101.47",
      device_id: "dev_new_888",
      card_bin: "424242",
      email: "test123@guerrillamail.com",
    },
  },
  {
    id: "fraud-account-takeover",
    label: "Account takeover",
    description: "Long-trusted user, sudden expensive jewelry purchase from a foreign IP.",
    kind: "fraud",
    expected_verdict: "DECLINE",
    tags: ["ATO", "country-mismatch", "high-amount"],
    transaction: {
      transaction_id: "txn_demo_fraud_003",
      user_id: "user_001",
      amount: 3200.0,
      currency: "EUR",
      merchant_category: "jewelry",
      ip_address: "104.244.74.12",
      device_id: "dev_unk_001",
      card_bin: "524432",
      email: "alice@gmail.com",
    },
  },
];
