import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

async function requireAdmin(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
}

export const getMenuImageUrl = query({
  args: {},
  handler: async (ctx) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "menuImage"))
      .unique();
    if (!setting) return null;

    const url = await ctx.storage.getUrl(setting.value as Id<"_storage">);
    return url ?? null;
  },
});

export const generateMenuUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setMenuImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "menuImage"))
      .unique();

    const previousStorageId = existing?.value as Id<"_storage"> | undefined;

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.storageId });
    } else {
      await ctx.db.insert("settings", {
        key: "menuImage",
        value: args.storageId,
      });
    }

    if (previousStorageId && previousStorageId !== args.storageId) {
      try {
        await ctx.storage.delete(previousStorageId);
      } catch {
        // Ignore — the previous file may have already been removed.
      }
    }

    return null;
  },
});
