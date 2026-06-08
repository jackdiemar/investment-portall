import "server-only";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "diemar_portal_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;

export type SessionRole = "portal" | "admin";

export type PortalSession = {
  role: SessionRole;
  issuedAt: number;
};

function normalizePassword(value: string) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createToken(role: SessionRole) {
  return Buffer.from(JSON.stringify({ role, issuedAt: Date.now() })).toString("base64url");
}

function verifyToken(token: string): PortalSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as PortalSession;
    if (parsed.role !== "admin" && parsed.role !== "portal") return null;
    if (Date.now() - parsed.issuedAt > SESSION_SECONDS * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}

export async function createSessionFromPassword(password: string) {
  const enteredPassword = normalizePassword(password);
  const portalPassword = normalizePassword(process.env.PORTAL_PASSWORD ?? "");
  const adminPassword = normalizePassword(process.env.ADMIN_PASSWORD ?? "");

  let role: SessionRole | null = null;
  if (adminPassword && secureEquals(enteredPassword, adminPassword)) role = "admin";
  if (!role && portalPassword && secureEquals(enteredPassword, portalPassword)) role = "portal";
  if (!role) return false;

  const token = createToken(role);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, getSessionCookieOptions());

  return true;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}
