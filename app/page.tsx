import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Eye, GitBranch, Activity, Terminal } from "lucide-react";

const TOOLS = [
  { name: "get_user_history", summary: "No prior chargebacks", status: "complete" },
  { name: "get_ip_risk", summary: "VPN detected · score 0.91", status: "complete" },
  { name: "get_device_fingerprint", summary: "New device, 0 prior txns", status: "complete" },
  { name: "check_blacklist", summary: "Card BIN 424242 flagged", status: "complete" },
  { name: "search_similar_cases", summary: "", status: "running" },
];

const FEATURES = [
  {
    icon: Terminal,
    title: "6 live data tools",
    body: "Calls user history, IP risk, device fingerprint, blacklist, case similarity, and cross-user velocity — no hallucinated context.",
  },
  {
    icon: Shield,
    title: "Grounded verdicts",
    body: "Every APPROVE or DECLINE cites at least one owner rule or retrieved case. The grounding contract is enforced at the application layer — uncited verdicts auto-escalate rather than guessing.",
  },
  {
    icon: Eye,
    title: "Real-time streaming",
    body: "Watch each tool execute as it happens over SSE. No dead spinners — just a live view of the agent thinking.",
  },
  {
    icon: GitBranch,
    title: "Escalation path",
    body: "When signals conflict or confidence is low, the agent escalates to a human reviewer rather than forcing a call.",
  },
  {
    icon: Activity,
    title: "Langfuse tracing",
    body: "Every run is traced end-to-end. Latency, tool calls, token usage, and the full reasoning chain — all observable.",
  },
  {
    icon: Zap,
    title: "Mock mode",
    body: "Runs the full UI experience without an Anthropic API key. Instant preset transactions, synthetic tool delays.",
  },
];

const TECH_STACK = [
  { label: "Claude Sonnet 4.6", detail: "LLM · structured tool use" },
  { label: "FastAPI", detail: "Python · SSE" },
  { label: "Next.js 15", detail: "App Router · RSC" },
  { label: "Go", detail: "stdlib · data API" },
  { label: "PostgreSQL", detail: "pgvector · RAG" },
];

const STEPS = [
  {
    num: "01",
    title: "Submit a transaction",
    body: "Paste any suspicious transaction — or click a preset. The agent receives user ID, amount, merchant, IP, device, and card details.",
  },
  {
    num: "02",
    title: "AI investigates",
    body: "Tessera calls five data tools in sequence, streaming each result back to the UI in real time as the agent reasons through the evidence.",
  },
  {
    num: "03",
    title: "Grounded verdict",
    body: "You get an APPROVE, DECLINE, or ESCALATE decision with the full reasoning, flagged signals, and cited sources — in seconds.",
  },
];

const HOW_IT_THINKS = [
  {
    num: "01",
    title: "Receive transaction",
    body: "User ID, amount, merchant, IP address, device fingerprint, and card BIN arrive as a structured payload.",
  },
  {
    num: "02",
    title: "Plan tool calls",
    body: "Claude decides which of the 6 data tools to call and in what order, based on the transaction context.",
  },
  {
    num: "03",
    title: "Execute tools sequentially",
    body: "Each tool call hits a live data API — user history, IP risk, device fingerprint, blacklist, case similarity, velocity.",
  },
  {
    num: "04",
    title: "Grounding override",
    body: "Before a verdict is emitted, the application layer checks: if cited_sources < 1, the decision is forced to ESCALATE. This is enforced in code, not in the prompt.",
  },
  {
    num: "05",
    title: "Emit a grounded verdict",
    body: "APPROVE, DECLINE, or ESCALATE — with cited sources, flagged signals, cost, and latency. Streamed live to your browser.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Top nav */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[5px] bg-gradient-to-br from-[var(--accent)] to-purple-600 flex items-center justify-center text-white text-xs font-extrabold shrink-0">
              T
            </div>
            <span className="text-sm font-semibold tracking-[-0.3px]">Tessera</span>
          </div>
          <nav className="hidden sm:flex items-center gap-8 text-sm text-[var(--muted)]">
            <Link href="/analyze" className="hover:text-[var(--foreground)] transition-colors">Analyze</Link>
            <Link href="/queue" className="hover:text-[var(--foreground)] transition-colors">Queue</Link>
            <Link href="/analytics" className="hover:text-[var(--foreground)] transition-colors">Analytics</Link>
          </nav>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-colors"
          >
            Open dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-44 pb-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-xs text-[var(--muted)] mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              AI Fraud Analyst · Powered by Claude Sonnet 4.6
            </div>
            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] leading-[1.06] font-bold tracking-[-1.5px] lg:tracking-[-2px] mb-7">
              Fraud decisions in{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #5865f2 0%, #a78bfa 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                seconds,
              </span>
              <br />
              with cited evidence.
            </h1>
            <p className="text-base sm:text-xl text-[var(--muted)] leading-7 sm:leading-8 max-w-2xl mx-auto mb-12">
              Tessera is an AI fraud analyst that investigates with 6 live data tools, then returns a
              verdict with citations — or escalates to a human reviewer. Never a guess.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-colors"
              >
                Run a live demo
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/queue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--accent)]/50 transition-colors"
              >
                View review queue
              </Link>
            </div>
          </div>
        </section>

        {/* Product preview */}
        <section className="px-8 pb-32">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[0_0_120px_rgba(88,101,242,0.09)]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
                <div className="w-3 h-3 rounded-full bg-[var(--border-strong)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--border-strong)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--border-strong)]" />
                <span className="ml-3 text-xs font-mono text-[var(--muted)]">tessera · analyze · txn_demo_fraud_001</span>
              </div>

              {/* Agent panel header */}
              <div className="px-6 pt-6 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-mono text-[var(--muted)] mb-1.5">AI Agent · claude-sonnet-4-6</p>
                    <p className="text-base font-medium text-[var(--foreground)]">Investigating transaction…</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning)]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
                    Running
                  </span>
                </div>
              </div>

              {/* Tool rows */}
              <div className="px-6 py-4 flex flex-col divide-y divide-[var(--border)]">
                {TOOLS.map((tool) => (
                  <div key={tool.name} className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0">
                    {tool.status === "complete" ? (
                      <CheckCircle2 size={15} className="text-[var(--success)] mt-0.5 shrink-0" />
                    ) : (
                      <span className="mt-1 w-4 h-4 shrink-0 flex items-center justify-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--warning)] animate-pulse" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-mono ${tool.status === "running" ? "text-[var(--warning)]" : "text-[var(--muted-strong)]"}`}>
                        {tool.name}
                      </p>
                      {tool.summary && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">{tool.summary}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Verdict preview */}
              <div className="mx-6 mb-6 mt-2 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger-soft)] px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--muted)] mb-1">Decision</p>
                  <p className="text-base font-semibold text-[var(--danger)]">DECLINE</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--muted)] mb-1">Risk score</p>
                  <p className="text-base font-semibold text-[var(--danger)]">92%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--muted)] mb-1">Latency</p>
                  <p className="text-base font-mono text-[var(--foreground)]">4 312 ms</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How the agent thinks */}
        <section className="px-8 pb-32">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-14 text-center">
              How the agent thinks
            </p>
            <div className="relative">
              {/* Left rail */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--border)]" />
              <div className="flex flex-col gap-10">
                {HOW_IT_THINKS.map((step) => (
                  <div key={step.num} className="flex gap-6">
                    <div className="w-10 h-10 rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] flex items-center justify-center text-xs font-mono text-[var(--muted)] shrink-0 relative z-10">
                      {step.num}
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-semibold text-[var(--foreground)] mb-1.5">{step.title}</p>
                      <p className="text-sm text-[var(--muted)] leading-7">{step.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-14 text-center">
              How it works
            </p>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.num}>
                  <p className="text-4xl font-bold font-mono text-[var(--border-strong)] mb-5">{step.num}</p>
                  <p className="text-base font-semibold text-[var(--foreground)] mb-3">{step.title}</p>
                  <p className="text-sm text-[var(--muted)] leading-7">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="px-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-14 text-center">
              Capabilities
            </p>
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-[var(--surface)] px-8 py-8">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface-2)] border border-[var(--border-strong)] flex items-center justify-center mb-5">
                    <Icon size={16} className="text-[var(--accent)]" strokeWidth={1.75} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--foreground)] mb-2">{title}</p>
                  <p className="text-sm text-[var(--muted)] leading-6">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="px-8 pb-32">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-10 text-center">
              Built with
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]">
              {TECH_STACK.map(({ label, detail }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center px-4 py-6 bg-[var(--surface)] text-center"
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">{label}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="px-8 pb-28">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-10 py-14 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">See it in action.</p>
                <p className="text-sm sm:text-base text-[var(--muted)] leading-7 max-w-lg">
                  Pick a preset transaction and watch the AI investigate it live.
                  No API key required in mock mode.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 transition-colors whitespace-nowrap"
                >
                  Try a live transaction
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] px-8 py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[3px] bg-gradient-to-br from-[var(--accent)] to-purple-600" />
            <span>Tessera — AI Fraud Analyst</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/analyze" className="hover:text-[var(--foreground)] transition-colors">Analyze</Link>
            <Link href="/queue" className="hover:text-[var(--foreground)] transition-colors">Queue</Link>
            <Link href="/analytics" className="hover:text-[var(--foreground)] transition-colors">Analytics</Link>
            <Link href="/evals" className="hover:text-[var(--foreground)] transition-colors">Evals</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
