import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
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

const DEFAULT_DELIVERY_TYPE = "delivery" as const;

export const createOrder = mutation({
  args: {
    name: v.string(),
    phoneNumber: v.string(),
    items: v.string(),
    deliveryType: v.optional(v.string()),
    deliveryTime: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const deliveryType =
      args.deliveryType?.trim() || DEFAULT_DELIVERY_TYPE;

    const orderId = await ctx.db.insert("orders", {
      name: args.name,
      phoneNumber: args.phoneNumber,
      items: args.items,
      deliveryType,
      deliveryTime: args.deliveryTime,
      notes: args.notes,
      status: "pending",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.email.sendOrderNotification, {
      orderId,
      name: args.name,
      phoneNumber: args.phoneNumber,
      items: args.items,
      deliveryTime: args.deliveryTime,
      notes: args.notes,
    });

    return orderId;
  },
});
