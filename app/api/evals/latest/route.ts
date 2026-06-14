export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const upstream = await fetch(
    `${process.env.TESSERA_AGENT_URL}/evals/latest`,
    {
      headers: { "X-Internal-Key": process.env.INTERNAL_API_KEY! },
      next: { revalidate: 0 },
    }
  );
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
