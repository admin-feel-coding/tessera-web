"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitFeedbackAction, type FeedbackActionState } from "./actions";
import type { Verdict } from "@/lib/types";

const SIGNAL_KEYS = [
  "user_history_flag",
  "ip_risk_flag",
  "device_fingerprint_flag",
  "blacklist_hit",
  "velocity_flag",
] as const;

const SIGNAL_LABELS: Record<(typeof SIGNAL_KEYS)[number], string> = {
  user_history_flag: "User history",
  ip_risk_flag: "IP risk",
  device_fingerprint_flag: "Device fingerprint",
  blacklist_hit: "Blacklist hit",
  velocity_flag: "Velocity",
};

interface Props {
  verdict: Verdict;
}

export function FeedbackForm({ verdict }: Props) {
  const [state, formAction, pending] = useActionState<
    FeedbackActionState,
    FormData
  >(submitFeedbackAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Hidden fields carry immutable context to the server action */}
      <input type="hidden" name="verdict_id" value={verdict.transaction_id} />
      <input
        type="hidden"
        name="original_verdict"
        value={JSON.stringify(verdict)}
      />

      {state && !state.ok && (
        <div
          role="alert"
          className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-4 py-3"
        >
          {state.error}
        </div>
      )}

      {/* Corrected decision */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="corrected_decision"
          className="text-sm font-medium text-neutral-700"
        >
          Decision
        </label>
        <select
          id="corrected_decision"
          name="corrected_decision"
          defaultValue={verdict.decision}
          className="border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <option value="APPROVE">APPROVE</option>
          <option value="DECLINE">DECLINE</option>
          <option value="ESCALATE">ESCALATE</option>
        </select>
      </div>

      {/* Analyst note */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="analyst_note"
          className="text-sm font-medium text-neutral-700"
        >
          Analyst note <span className="text-red-500">*</span>
        </label>
        <textarea
          id="analyst_note"
          name="analyst_note"
          rows={4}
          required
          placeholder="Why is this the correct decision? Cite a specific signal or precedent."
          className="border border-neutral-200 rounded-md px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-neutral-400"
        />
      </div>

      {/* Decisive signals */}
      <fieldset>
        <legend className="text-sm font-medium text-neutral-700 mb-3">
          Decisive signals
        </legend>
        <div className="flex flex-col gap-2">
          {SIGNAL_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="decisive_signals"
                value={key}
                defaultChecked={verdict.signals[key]}
                className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
              />
              <span className="text-sm text-neutral-700">
                {SIGNAL_LABELS[key]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {pending ? "Submitting..." : "Submit feedback"}
        </button>
        <Link
          href={`/verdicts/${verdict.transaction_id}`}
          className="text-sm text-neutral-500 hover:underline"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
