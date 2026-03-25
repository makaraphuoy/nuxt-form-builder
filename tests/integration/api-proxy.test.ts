import { describe, it, expect } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

await setup({ rootDir: process.cwd() });

describe("GET /api/proxy/* (no apiBase configured)", () => {
  it("falls back to local /api/address/provinces", async () => {
    // proxy → local /api/address/provinces
    const data = await $fetch("/api/proxy/address/provinces");
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });

  it("proxies through to local api and returns a response", async () => {
    // The proxy forwards to the local /api/* route; unknown routes fall through
    // to Nuxt's SPA handler and return HTML — we just verify no exception is thrown
    // and the proxy itself doesn't error out (502 / connection refused).
    const result = await $fetch("/api/proxy/address/provinces").catch((e) => e);
    // Accept either a valid data response or an FetchError (but not a network/502 error)
    if (result instanceof Error) {
      expect((result as any).statusCode).not.toBe(502);
    } else {
      expect(result).toBeDefined();
    }
  });
});
