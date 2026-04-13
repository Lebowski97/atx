export const STOREFRONT_SESSION_COOKIE_NAME = "tt-session";
export const STOREFRONT_SESSION_DURATION_MS = 3 * 60 * 60 * 1000;
export const STOREFRONT_SESSION_MAX_AGE_SECONDS =
  STOREFRONT_SESSION_DURATION_MS / 1000;

function getStorefrontSessionSecret() {
  const secret = process.env.STOREFRONT_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("STOREFRONT_SESSION_SECRET is not configured");
  }
  return secret;
}

async function signValue(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getStorefrontSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(signatureBuffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function createStorefrontSessionToken(now = Date.now()) {
  const expiresAt = now + STOREFRONT_SESSION_DURATION_MS;
  const signature = await signValue(String(expiresAt));
  return `${expiresAt}.${signature}`;
}

export async function verifyStorefrontSessionToken(
  token: string | undefined,
  now = Date.now(),
) {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, signature, ...rest] = token.split(".");
  if (!expiresAtRaw || !signature || rest.length > 0) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) {
    return false;
  }

  const expectedSignature = await signValue(expiresAtRaw);
  return signature === expectedSignature;
}
