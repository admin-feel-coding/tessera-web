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

const INPUT_CLASS =
  "w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--surface-2)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none transition-colors";

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
          className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] border border-[var(--danger)]/30 rounded-lg px-4 py-3"
        >
          {state.error}
        </div>
      )}

      {/* Corrected decision */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="corrected_decision"
          className="text-xs font-medium text-[var(--muted)]"
        >
          Decision
        </label>
        <select
          id="corrected_decision"
          name="corrected_decision"
          defaultValue={verdict.decision}
          className={INPUT_CLASS}
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
          className="text-xs font-medium text-[var(--muted)]"
        >
          Analyst note <span className="text-[var(--danger)]">*</span>
        </label>
        <textarea
          id="analyst_note"
          name="analyst_note"
          rows={4}
          required
          placeholder="Why is this the correct decision? Cite a specific signal or precedent."
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>

      {/* Decisive signals */}
      <fieldset>
        <legend className="text-xs font-medium text-[var(--muted)] mb-3">
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
                className="rounded border-[var(--border)] accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--muted)]">
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
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {pending ? "Submitting..." : "Submit feedback"}
        </button>
        <Link
          href={`/verdicts/${verdict.transaction_id}`}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
