import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireStorefrontServerSecret } from "./access";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    return setting;
  },
});

export const validatePasscode = query({
  args: { passcode: v.string(), storefrontSecret: v.string() },
  handler: async (ctx, args) => {
    requireStorefrontServerSecret(args.storefrontSecret);
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "passcode"))
      .unique();
    if (!setting) return false;
    return setting.value === args.passcode;
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});

export const getPasscode = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "passcode"))
      .unique();
    return setting?.value ?? null;
  },
});

export const updatePasscode = mutation({
  args: { passcode: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const value = args.passcode.trim();
    if (value.length === 0) {
      throw new Error("Passcode cannot be empty");
    }
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "passcode"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("settings", { key: "passcode", value });
    }
    return null;
  },
});

export const getStoreInfo = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "storeInfo"))
      .unique();
    return setting?.value ?? null;
  },
});

export const getStoreInfoAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "storeInfo"))
      .unique();
    return setting?.value ?? null;
  },
});

export const updateStoreInfo = mutation({
  args: { storeInfo: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const value = args.storeInfo.trim();
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "storeInfo"))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("settings", { key: "storeInfo", value });
    }
    return null;
  },
});
