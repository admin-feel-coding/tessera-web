import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function originAllowed(req: Request): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return true; // dev: allow all origins
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";
  return origin.startsWith(siteUrl) || referer.startsWith(siteUrl);
}

export async function POST(req: Request) {
  // Block cross-origin requests (prevents embedding the endpoint in third-party pages).
  if (!originAllowed(req)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Per-IP rate limit + global daily cap.
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Too many requests. Please wait and try again." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    });
  }

  const upstream = await fetch(
    `${process.env.TESSERA_AGENT_URL ?? "http://localhost:8001"}/analyze/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": process.env.INTERNAL_API_KEY ?? "dev-secret-change-in-prod",
      },
      body: await req.text(),
    }
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
