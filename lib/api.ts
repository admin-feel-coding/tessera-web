import type { Transaction, Verdict, FeedbackPayload, EvalSummary } from "./types";
import { MOCK_VERDICTS, getVerdictById } from "./mock-verdicts";

const AGENT_URL = process.env.TESSERA_AGENT_URL ?? "http://localhost:8001";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "dev-secret-change-in-prod";

const headers = {
  "Content-Type": "application/json",
  "X-Internal-Key": INTERNAL_API_KEY,
};

export async function analyzeTransaction(txn: Transaction): Promise<Verdict> {
  const res = await fetch(`${AGENT_URL}/analyze`, {
    method: "POST",
    headers,
    body: JSON.stringify(txn),
    cache: "no-store",
  });
  if (!res.ok) throw await res.json();
  return res.json() as Promise<Verdict>;
}

export async function sendFeedback(payload: FeedbackPayload): Promise<{ case_id?: string }> {
  const res = await fetch(`${AGENT_URL}/feedback`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw await res.json();
  return res.json() as Promise<{ case_id?: string }>;
}

export async function listVerdicts(): Promise<Verdict[]> {
  try {
    const res = await fetch(`${AGENT_URL}/verdicts`, {
      headers: { "X-Internal-Key": INTERNAL_API_KEY },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.verdicts ?? [];
  } catch {
    // tessera-agent not running — fall back to mock data
    return MOCK_VERDICTS;
  }
}

export async function getVerdict(id: string): Promise<Verdict | null> {
  try {
    const res = await fetch(`${AGENT_URL}/verdicts/${id}`, {
      headers: { "X-Internal-Key": INTERNAL_API_KEY },
      cache: "no-store",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return getVerdictById(id) ?? null;
  }
}

export async function getLatestEval(): Promise<EvalSummary | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/evals/latest`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
