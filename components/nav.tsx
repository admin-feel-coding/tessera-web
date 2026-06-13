import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b px-4 py-3 flex gap-6 items-center">
      <span className="font-semibold text-lg">Tessera</span>
      <Link href="/analyze" className="text-sm hover:underline">Analyze</Link>
      <Link href="/" className="text-sm hover:underline">Queue</Link>
      <Link href="/analytics" className="text-sm hover:underline">Analytics</Link>
      <Link href="/evals" className="text-sm hover:underline">Evals</Link>
    </nav>
  );
}
