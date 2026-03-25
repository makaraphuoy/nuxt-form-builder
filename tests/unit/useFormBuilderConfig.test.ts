import { describe, it, expect, vi } from "vitest";

// Mock useRuntimeConfig before importing the composable
vi.mock("#app", () => ({
  useRuntimeConfig: () => ({ public: {} }),
}));

import { useFormBuilderConfig } from "~/composables/useFormBuilderConfig";

describe("useFormBuilderConfig", () => {
  it("returns default proxyBase", () => {
    const config = useFormBuilderConfig();
    expect(config.proxyBase).toBe("/api/proxy");
  });

  it("returns empty headers by default", () => {
    const config = useFormBuilderConfig();
    expect(config.headers).toEqual({});
  });
});
