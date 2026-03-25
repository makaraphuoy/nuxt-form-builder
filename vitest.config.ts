import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    exclude: ["tests/e2e/**", "tests/integration/**", "node_modules/**"],
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "composables/**",
        "utils/**",
        "server/api/**",
        "components/v2/**",
      ],
      exclude: ["**/_data.ts", "**/_store.ts"],
    },
  },
});
