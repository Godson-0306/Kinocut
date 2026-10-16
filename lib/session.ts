import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findUserById, type SessionUser } from "@/lib/accounts";

const COOKIE = "kinocut_session";
const MONTH = 60 * 60 * 24 * 30;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("Auth is not configured");
  return value;
}

function seal(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + MONTH * 1000 })).toString("base64url");
  const mac = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

function open(token: string) {
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { userId?: string; exp?: number };
    if (!data.userId || !data.exp || data.exp < Date.now()) return null;
    return data.userId;
  } catch {
    return null;
  }
}

export async function currentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const userId = open(token);
  if (!userId) return null;
  return findUserById(userId).catch(() => null);
}

export async function setSession(userId: string) {
  (await cookies()).set(COOKIE, seal(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MONTH,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}
