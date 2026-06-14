const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_IP = 5;
const GLOBAL_DAILY_CAP = 200;

type Slot = { count: number; resetAt: number };

const perIp = new Map<string, Slot>();
const globalDaily = { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 };

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Reset global daily counter if the window has passed.
  if (now > globalDaily.resetAt) {
    globalDaily.count = 0;
    globalDaily.resetAt = now + 24 * 60 * 60 * 1000;
  }

  if (globalDaily.count >= GLOBAL_DAILY_CAP) {
    return { allowed: false, retryAfterSec: Math.ceil((globalDaily.resetAt - now) / 1000) };
  }

  const slot = perIp.get(ip);

  if (!slot || now > slot.resetAt) {
    perIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    globalDaily.count++;
    return { allowed: true, retryAfterSec: 0 };
  }

  if (slot.count >= MAX_PER_IP) {
    return { allowed: false, retryAfterSec: Math.ceil((slot.resetAt - now) / 1000) };
  }

  slot.count++;
  globalDaily.count++;
  return { allowed: true, retryAfterSec: 0 };
}
