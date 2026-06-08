import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "diemar_portal_session";
const SESSION_SECONDS = 60 * 60 * 12;

export type SessionRole = "portal" | "admin";

export type PortalSession = {
  role: SessionRole;
  issuedAt: number;
};

function getSessionSecret() {
  const portalPassword = normalizePassword(process.env.PORTAL_PASSWORD ?? "");
  const adminPassword = normalizePassword(process.env.ADMIN_PASSWORD ?? "");
  if (!portalPassword && !adminPassword) return null;
  return `${portalPassword}:${adminPassword}`;
}

function normalizePassword(value: string) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  const secret = getSessionSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function secureEquals(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createToken(role: SessionRole) {
  const payload = encodeBase64Url(JSON.stringify({ role, issuedAt: Date.now() }));
  const signature = sign(payload);
  if (!signature) return null;
  return `${payload}.${signature}`;
}

function verifyToken(token: string): PortalSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  if (!expectedSignature || !secureEquals(signature, expectedSignature)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as PortalSession;
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
  if (session.role !== "admin") redirect("/");
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
  if (!token) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  return true;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
