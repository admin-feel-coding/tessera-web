"use server";

import { redirect } from "next/navigation";
import { sendFeedback } from "@/lib/api";
import type { Verdict, FeedbackPayload, Decision } from "@/lib/types";

export type FeedbackActionState = { ok: false; error: string } | undefined;

const VALID_DECISIONS: Decision[] = ["APPROVE", "DECLINE", "ESCALATE"];

function isDecision(value: string): value is Decision {
  return (VALID_DECISIONS as string[]).includes(value);
}

export async function submitFeedbackAction(
  _prevState: FeedbackActionState,
  formData: FormData
): Promise<FeedbackActionState> {
  const verdictId = formData.get("verdict_id");
  const rawVerdict = formData.get("original_verdict");
  const rawDecision = formData.get("corrected_decision");
  const analystNote = formData.get("analyst_note");
  const decisiveSignals = formData.getAll("decisive_signals") as string[];

  if (typeof verdictId !== "string" || verdictId.length === 0) {
    return { ok: false, error: "Missing verdict ID." };
  }
  if (typeof rawVerdict !== "string") {
    return { ok: false, error: "Missing original verdict data." };
  }
  if (typeof rawDecision !== "string" || !isDecision(rawDecision)) {
    return { ok: false, error: "Invalid decision value." };
  }
  if (typeof analystNote !== "string" || analystNote.trim().length === 0) {
    return { ok: false, error: "Analyst note is required." };
  }

  let originalVerdict: Verdict;
  try {
    originalVerdict = JSON.parse(rawVerdict) as Verdict;
  } catch {
    return { ok: false, error: "Malformed verdict data." };
  }

  const payload: FeedbackPayload = {
    transaction_id: verdictId,
    corrected_decision: rawDecision,
    analyst_note: analystNote.trim(),
    decisive_signals: decisiveSignals,
    original_verdict: originalVerdict,
  };

  try {
    await sendFeedback(payload);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Failed to submit feedback.";
    return { ok: false, error: message };
  }

  redirect(`/verdicts/${verdictId}?feedback=submitted`);
}
