import type { Transaction } from "./types";

const MERCHANTS = ["groceries", "electronics", "jewelry", "streaming", "airline", "gas_station", "restaurant", "clothing", "pharmacy"];
const CURRENCIES = ["USD", "EUR", "GBP", "MXN"] as const;
const FIRST_NAMES = ["alice", "bob", "carol", "dave", "eve", "frank", "grace", "hal", "iris", "jack"];
const LAST_NAMES = ["smith", "jones", "brown", "wilson", "moore", "taylor", "anderson", "thomas"];
const CLEAN_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"];
const RISKY_DOMAINS = ["protonmail.com", "tutanota.com", "guerrillamail.com", "tempmail.com"];
const CLEAN_BINS = ["411111", "401288", "378282", "370144", "550000"];
const RISKY_BINS = ["524432", "552600"];
const BLACKLISTED_BINS = ["424242"];

function lcg(seed: number) {
  let s = seed >>> 0;
  return function next() {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return s / 0x100000000;
  };
}

export function randomTransaction(seed?: number): Transaction {
  const rand = lcg(seed !== undefined ? seed : Date.now() & 0xffffffff);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];

  const logAmount = 1 + rand() * 3.4; // 10..3000 log-uniform
  const amount = Math.round(Math.pow(10, logAmount) * 100) / 100;

  const ipClass = rand();
  let ip_address: string;
  if (ipClass < 0.5) {
    ip_address = `192.168.${Math.floor(rand()*255)}.${Math.floor(rand()*255)}`;
  } else if (ipClass < 0.75) {
    ip_address = `24.${Math.floor(rand()*255)}.${Math.floor(rand()*255)}.${Math.floor(rand()*255)}`;
  } else if (ipClass < 0.9) {
    ip_address = `185.220.101.${Math.floor(rand()*200)+1}`;
  } else {
    ip_address = `104.244.${Math.floor(rand()*10)+72}.${Math.floor(rand()*255)}`;
  }

  const binClass = rand();
  let card_bin: string;
  if (binClass < 0.7) card_bin = pick(CLEAN_BINS);
  else if (binClass < 0.9) card_bin = pick(RISKY_BINS);
  else card_bin = pick(BLACKLISTED_BINS);

  const emailDomain = rand() < 0.8 ? pick(CLEAN_DOMAINS) : pick(RISKY_DOMAINS);
  const email = `${pick(FIRST_NAMES)}.${pick(LAST_NAMES)}@${emailDomain}`;

  const userId = `user_${Math.floor(rand() * 9000 + 1000)}`;
  const deviceId = `dev_${Math.floor(rand() * 9000 + 1000).toString(16)}`;
  const txnSuffix = (Date.now() % 100000).toString(36);

  return {
    transaction_id: `txn_rnd_${txnSuffix}`,
    user_id: userId,
    amount,
    currency: pick(CURRENCIES),
    merchant_category: pick(MERCHANTS),
    ip_address,
    device_id: deviceId,
    card_bin,
    email,
  };
}
