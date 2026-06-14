"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { Preset } from "@/lib/presets";
import type { Transaction } from "@/lib/types";
import { randomTransaction } from "@/lib/generators";
import { AgentPanel } from "./agent-panel";
import { ScenarioGallery } from "./scenario-gallery";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

type SseEvent = { type: string; data: Record<string, unknown> };
type PageState = "idle" | "streaming" | "error";

function emptyTransaction(): Transaction {
  return {
    transaction_id: "",
    user_id: "",
    amount: 0,
    currency: "USD",
    merchant_category: "",
    ip_address: "",
    device_id: "",
    card_bin: "",
    email: "",
  };
}

export function AnalyzeClient() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("idle");
  const [events, setEvents] = useState<SseEvent[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<Transaction>(emptyTransaction());
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [streamingTxnId, setStreamingTxnId] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  function applyPreset(preset: Preset) {
    const freshId = `txn_demo_${preset.kind}_${Date.now()}`;
    setForm({ ...preset.transaction, transaction_id: freshId });
    setSelectedPresetId(preset.id);
    setShowAdvanced(true);
  }

  function handleRandomize() {
    setForm(randomTransaction());
    setSelectedPresetId(undefined);
    setShowAdvanced(true);
  }

  function handleField(field: keyof Transaction, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSelectedPresetId(undefined);
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const txn: Transaction = {
      ...form,
      amount: typeof form.amount === "string" ? parseFloat(form.amount as unknown as string) : form.amount,
    };
    setStreamingTxnId(txn.transaction_id);
    setPageState("streaming");
    setEvents([]);

    try {
      const res = await fetch("/api/analyze/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txn),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const frames = buf.split("\n\n");
        buf = frames.pop() ?? "";
        for (const frame of frames) {
          if (!frame.trim()) continue;
          const typeMatch = frame.match(/^event: (\w+)/m);
          const dataMatch = frame.match(/^data: (.+)/m);
          if (!typeMatch || !dataMatch) continue;
          const type = typeMatch[1];
          const data = JSON.parse(dataMatch[1]) as Record<string, unknown>;
          setEvents((prev) => [...prev, { type, data }]);
          if (type === "verdict") {
            await new Promise((r) => setTimeout(r, 800));
            router.push(`/verdicts/${data.transaction_id as string}`);
            return;
          }
          if (type === "error") {
            setPageState("error");
            setErrorMsg(typeof data.message === "string" ? data.message : "Unknown error");
            return;
          }
        }
      }
    } catch (e) {
      setPageState("error");
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
    }
  }

  // Cmd+Enter shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  if (pageState === "streaming") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div>
            <p className="text-[11px] text-[var(--accent)] font-medium tracking-widest uppercase mb-2">
              AI Agent
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Analyzing transaction
            </h1>
            <p className="text-xs font-mono text-[var(--muted)] mt-1">
              {streamingTxnId}
            </p>
          </div>
          <AgentPanel events={events} />
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Analysis failed
            </h1>
          </div>
          <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
            {errorMsg}
          </div>
          <Button
            variant="ghost"
            className="self-start text-sm"
            onClick={() => { setPageState("idle"); setEvents([]); setErrorMsg(""); }}
          >
            ← Try again
          </Button>
        </div>
      </div>
    );
  }

  // Idle state
  return (
    <div className="max-w-5xl mx-auto px-0 py-0">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-[-0.5px] text-[var(--foreground)]">
          Analyze transaction
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed max-w-xl">
          Investigate any transaction with 6 live data tools. The agent returns a grounded verdict — or escalates.
        </p>
      </div>

      {/* Scenario gallery */}
      <div className="mb-8 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
        <ScenarioGallery
          onSelect={applyPreset}
          onRandomize={handleRandomize}
          selectedId={selectedPresetId}
        />
      </div>

      {/* Transaction form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          {/* Form header */}
          <div className="px-6 py-5 border-b border-[var(--border)]">
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              Transaction
            </p>
          </div>

          {/* Core fields */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Transaction ID">
                <Input
                  required
                  value={form.transaction_id}
                  onChange={(e) => handleField("transaction_id", e.target.value)}
                  placeholder="txn_001"
                />
              </Field>
              <Field label="User ID">
                <Input
                  required
                  value={form.user_id}
                  onChange={(e) => handleField("user_id", e.target.value)}
                  placeholder="user_001"
                />
              </Field>
              <Field label="Amount">
                <Input
                  type="number"
                  required
                  step="0.01"
                  min="0.01"
                  value={form.amount || ""}
                  onChange={(e) => handleField("amount", e.target.value)}
                  placeholder="100.00"
                />
              </Field>
              <Field label="Currency">
                <Select
                  required
                  value={form.currency}
                  onChange={(e) => handleField("currency", e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="MXN">MXN</option>
                </Select>
              </Field>
              <Field label="Merchant category" className="sm:col-span-2">
                <Input
                  required
                  value={form.merchant_category}
                  onChange={(e) => handleField("merchant_category", e.target.value)}
                  placeholder="electronics"
                />
              </Field>
            </div>
          </div>

          {/* Advanced section */}
          <div className="border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[var(--surface-2)] transition-colors"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Advanced
              </p>
              <ChevronDown
                size={14}
                className={cn(
                  "text-[var(--muted)] transition-transform duration-200",
                  showAdvanced && "rotate-180"
                )}
              />
            </button>
            {showAdvanced && (
              <div className="p-6 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <Field label="Email">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleField("email", e.target.value)}
                      placeholder="user@example.com"
                    />
                  </Field>
                  <Field label="IP address">
                    <Input
                      value={form.ip_address}
                      onChange={(e) => handleField("ip_address", e.target.value)}
                      placeholder="1.2.3.4"
                    />
                  </Field>
                  <Field label="Device ID">
                    <Input
                      value={form.device_id}
                      onChange={(e) => handleField("device_id", e.target.value)}
                      placeholder="dev_001"
                    />
                  </Field>
                  <Field label="Card BIN">
                    <Input
                      value={form.card_bin}
                      onChange={(e) => handleField("card_bin", e.target.value)}
                      placeholder="424242"
                    />
                  </Field>
                </div>
              </div>
            )}
          </div>

          {/* Footer / submit */}
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-xs text-[var(--muted)] font-mono">
              claude-sonnet-4-6 · 6 tools
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <Kbd>⌘</Kbd><Kbd>↵</Kbd>
              </div>
              <Button variant="primary" type="submit">
                Run analysis
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
