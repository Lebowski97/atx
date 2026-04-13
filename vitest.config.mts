import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "edge-runtime",
    include: ["apps/**/*.test.ts", "convex/**/*.test.ts"],
  },
});
