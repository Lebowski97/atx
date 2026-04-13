import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { requireAdmin, requireStorefrontServerSecret } from "./access";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivered",
  "completed",
] as const;

const orderStatusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("preparing"),
  v.literal("ready"),
  v.literal("delivered"),
  v.literal("completed"),
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("orders")
      .withIndex("by_createdAt")
      .order("desc")
      .take(50);
  },
});

export const listOrders = query({
  args: {
    status: v.optional(orderStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.status !== undefined) {
      const status = args.status;
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .take(200);
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_createdAt")
      .order("desc")
      .take(200);
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: orderStatusValidator,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.orderId, { status: args.status });
    return null;
  },
});

const DEFAULT_DELIVERY_TYPE = "delivery" as const;

export const createOrder = mutation({
  args: {
    name: v.string(),
    phoneNumber: v.string(),
    address: v.string(),
    items: v.string(),
    storefrontSecret: v.string(),
    deliveryType: v.optional(v.string()),
    deliveryTime: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireStorefrontServerSecret(args.storefrontSecret);
    const deliveryType =
      args.deliveryType?.trim() || DEFAULT_DELIVERY_TYPE;

    const orderId = await ctx.db.insert("orders", {
      name: args.name,
      phoneNumber: args.phoneNumber,
      address: args.address,
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
      address: args.address,
      items: args.items,
      deliveryTime: args.deliveryTime,
      notes: args.notes,
    });

    return orderId;
  },
});
