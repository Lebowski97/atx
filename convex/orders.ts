import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_createdAt")
      .order("desc")
      .take(50);
  },
});

export const createOrder = mutation({
  args: {
    name: v.string(),
    phoneNumber: v.string(),
    items: v.string(),
    deliveryType: v.string(),
    deliveryTime: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});
