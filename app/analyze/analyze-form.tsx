"use client";

import { useActionState } from "react";
import { analyzeAction, type AnalyzeActionState } from "./actions";
import { Card, CardContent } from "@/components/ui/card";

const INPUT_CLASS =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900";

const SELECT_CLASS =
  "w-full rounded-md border border-neutral-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900";

const LABEL_CLASS = "text-sm font-medium text-neutral-700";

export function AnalyzeForm() {
  const [state, formAction, pending] = useActionState<
    AnalyzeActionState,
    FormData
  >(analyzeAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state && !state.ok && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* transaction_id */}
            <div className="flex flex-col gap-2">
              <label htmlFor="transaction_id" className={LABEL_CLASS}>
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                id="transaction_id"
                name="transaction_id"
                type="text"
                required
                placeholder="txn_001"
                className={INPUT_CLASS}
              />
            </div>

            {/* user_id */}
            <div className="flex flex-col gap-2">
              <label htmlFor="user_id" className={LABEL_CLASS}>
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                id="user_id"
                name="user_id"
                type="text"
                required
                placeholder="user_001"
                className={INPUT_CLASS}
              />
            </div>

            {/* amount */}
            <div className="flex flex-col gap-2">
              <label htmlFor="amount" className={LABEL_CLASS}>
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                step="0.01"
                min="0.01"
                placeholder="100.00"
                className={INPUT_CLASS}
              />
            </div>

            {/* currency */}
            <div className="flex flex-col gap-2">
              <label htmlFor="currency" className={LABEL_CLASS}>
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                id="currency"
                name="currency"
                defaultValue="USD"
                className={SELECT_CLASS}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="MXN">MXN</option>
              </select>
            </div>

            {/* merchant_category */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="merchant_category" className={LABEL_CLASS}>
                Merchant Category <span className="text-red-500">*</span>
              </label>
              <input
                id="merchant_category"
                name="merchant_category"
                type="text"
                required
                placeholder="electronics"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* Optional fields */}
          <div className="mt-5 pt-5 border-t border-neutral-100">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-4">
              Optional signals
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={LABEL_CLASS}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@example.com"
                  className={INPUT_CLASS}
                />
              </div>

              {/* ip_address */}
              <div className="flex flex-col gap-2">
                <label htmlFor="ip_address" className={LABEL_CLASS}>
                  IP Address
                </label>
                <input
                  id="ip_address"
                  name="ip_address"
                  type="text"
                  placeholder="1.2.3.4"
                  className={INPUT_CLASS}
                />
              </div>

              {/* device_id */}
              <div className="flex flex-col gap-2">
                <label htmlFor="device_id" className={LABEL_CLASS}>
                  Device ID
                </label>
                <input
                  id="device_id"
                  name="device_id"
                  type="text"
                  placeholder="dev_001"
                  className={INPUT_CLASS}
                />
              </div>

              {/* card_bin */}
              <div className="flex flex-col gap-2">
                <label htmlFor="card_bin" className={LABEL_CLASS}>
                  Card BIN
                </label>
                <input
                  id="card_bin"
                  name="card_bin"
                  type="text"
                  placeholder="424242"
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {pending ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </form>
  );
}
