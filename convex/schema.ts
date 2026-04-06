import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    name: v.string(),
    phoneNumber: v.string(),
    items: v.string(),
    deliveryType: v.string(),
    deliveryTime: v.string(),
    notes: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
