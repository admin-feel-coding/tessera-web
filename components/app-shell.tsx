import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <MobileHeader />
      <main className="md:ml-[240px] min-h-screen bg-[var(--background)]">
        {/* pt-12 / pb-20 account for the mobile top bar + bottom tabs */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-16 pb-24 md:py-10">
          {children}
        </div>
      </main>
    </>
  );
}
