/// <reference types="vite/client" />

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import { api } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

describe("Convex auth boundaries", () => {
  beforeEach(() => {
    vi.stubEnv("HQ_ADMIN_EMAILS", "owner@example.com,teammate@example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects non-admin passcode reads", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      await ctx.db.insert("settings", { key: "passcode", value: "pineapple" });
    });

    await expect(
      t.withIdentity({ email: "guest@example.com" }).query(
        api.settings.getPasscode,
        {},
      ),
    ).rejects.toThrow(/authorized/i);
  });

  it("rejects non-admin order list access", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      await ctx.db.insert("orders", {
        name: "Pat",
        phoneNumber: "5125551111",
        address: "123 Main St",
        items: "1 lb tomatoes",
        deliveryType: "delivery",
        deliveryTime: "Today 5pm",
        notes: "Leave at door",
        status: "pending",
        createdAt: Date.now(),
      });
    });

    await expect(
      t.withIdentity({ email: "guest@example.com" }).query(
        api.orders.listOrders,
        {},
      ),
    ).rejects.toThrow(/authorized/i);
  });

  it("allows admin order access by token identifier without an email claim", async () => {
    const t = convexTest(schema, modules);
    vi.stubEnv(
      "HQ_ADMIN_IDENTIFIERS",
      "https://example.clerk.accounts.dev|user_123",
    );

    await t.run(async (ctx) => {
      await ctx.db.insert("orders", {
        name: "Pat",
        phoneNumber: "5125551111",
        address: "123 Main St",
        items: "1 lb tomatoes",
        deliveryType: "delivery",
        deliveryTime: "Today 5pm",
        notes: "Leave at door",
        status: "pending",
        createdAt: Date.now(),
      });
    });

    await expect(
      t.withIdentity({
        tokenIdentifier: "https://example.clerk.accounts.dev|user_123",
        issuer: "https://example.clerk.accounts.dev",
      }).query(api.orders.listOrders, {}),
    ).resolves.toHaveLength(1);
  });

  it("rejects direct anonymous order creation", async () => {
    const t = convexTest(schema, modules);

    await expect(
      t.mutation(api.orders.createOrder, {
        name: "Pat",
        phoneNumber: "5125551111",
        address: "123 Main St",
        items: "1 lb tomatoes",
        deliveryType: "delivery",
        deliveryTime: "Today 5pm",
        notes: "Leave at door",
      }),
    ).rejects.toThrow();
  });
});
