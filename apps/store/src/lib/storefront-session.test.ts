import { afterEach, describe, expect, it, vi } from "vitest";
import {
  STOREFRONT_SESSION_DURATION_MS,
  createStorefrontSessionToken,
  verifyStorefrontSessionToken,
} from "./storefront-session";

describe("storefront session tokens", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts a freshly issued token", async () => {
    vi.stubEnv("STOREFRONT_SESSION_SECRET", "session-secret");

    const now = Date.UTC(2026, 3, 8, 12, 0, 0);
    const token = await createStorefrontSessionToken(now);

    await expect(verifyStorefrontSessionToken(token, now)).resolves.toBe(true);
  });

  it("rejects a tampered token", async () => {
    vi.stubEnv("STOREFRONT_SESSION_SECRET", "session-secret");

    const now = Date.UTC(2026, 3, 8, 12, 0, 0);
    const token = await createStorefrontSessionToken(now);
    const tamperedToken = `${token}x`;

    await expect(
      verifyStorefrontSessionToken(tamperedToken, now),
    ).resolves.toBe(false);
  });

  it("rejects an expired token after three hours", async () => {
    vi.stubEnv("STOREFRONT_SESSION_SECRET", "session-secret");

    const now = Date.UTC(2026, 3, 8, 12, 0, 0);
    const token = await createStorefrontSessionToken(now);

    await expect(
      verifyStorefrontSessionToken(token, now + STOREFRONT_SESSION_DURATION_MS),
    ).resolves.toBe(false);
  });
});
