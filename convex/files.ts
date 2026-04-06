import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
