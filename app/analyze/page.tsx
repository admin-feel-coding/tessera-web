import { AnalyzeClient } from "./analyze-client";
import { AppShell } from "@/components/app-shell";

export default function AnalyzePage() {
  return (
    <AppShell>
      <AnalyzeClient />
    </AppShell>
  );
}
