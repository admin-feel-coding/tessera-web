"use server";

import { redirect } from "next/navigation";
import { analyzeTransaction } from "@/lib/api";

export type AnalyzeActionState = { ok: false; error: string } | undefined;

export async function analyzeAction(
  _prevState: AnalyzeActionState,
  formData: FormData
): Promise<AnalyzeActionState> {
  const emailRaw = formData.get("email") as string;
  const ipRaw = formData.get("ip_address") as string;
  const deviceRaw = formData.get("device_id") as string;
  const cardBinRaw = formData.get("card_bin") as string;

  const payload = {
    transaction_id: formData.get("transaction_id") as string,
    user_id: formData.get("user_id") as string,
    amount: parseFloat(formData.get("amount") as string),
    currency: formData.get("currency") as string,
    merchant_category: formData.get("merchant_category") as string,
    email: emailRaw || "",
    ip_address: ipRaw || "",
    device_id: deviceRaw || "",
    card_bin: cardBinRaw || "",
  };

  let verdict;
  try {
    verdict = await analyzeTransaction(payload);
  } catch {
    return { ok: false, error: "Analysis failed. Is tessera-agent running?" };
  }

  redirect(`/verdicts/${verdict.transaction_id}`);
}
