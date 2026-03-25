import { defineConfig } from "vitest/config";

// Integration tests spin up a real Nitro server via @nuxt/test-utils/e2e.
// They must run in the Node.js environment — NOT the nuxt/browser environment.
export default defineConfig({
  test: {
    include: ["tests/integration/**/*.test.ts"],
    environment: "node",
    testTimeout: 60_000, // Nitro server startup can be slow
    hookTimeout: 60_000,
    reporters: ["verbose"],
  },
});
