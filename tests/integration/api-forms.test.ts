import { describe, it, expect, beforeAll } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";
import type { JSONFormConfig } from "~/utils/form-schema";

await setup({ rootDir: process.cwd() });

// Use a fixed id so tests stay idempotent across runs
const TEST_ID = `integration-test-form-${Date.now()}`;

const testForm: JSONFormConfig = {
  id: TEST_ID,
  title: "Integration Test Form",
  pages: [
    {
      id: "p1",
      title: "Page 1",
      sections: [
        {
          id: "s1",
          title: "Section 1",
          rows: [
            {
              id: "r1",
              layout: "auto",
              gap: "md",
              fields: [
                { name: "name", label: "Name", component: "UInput", type: "text", colSpan: 12 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Single top-level describe — context from setup() is available in all hooks here
describe("server/api/forms", () => {
  beforeAll(async () => {
    // Ensure a clean slate — ignore 404 if already absent
    await $fetch(`/api/forms/${TEST_ID}`, { method: "DELETE" }).catch(() => null);
  });

  describe("POST /api/forms", () => {
    it("saves a form and returns the entry", async () => {
      const res = await $fetch<{ form: any }>("/api/forms", {
        method: "POST",
        body: { config: testForm, name: testForm.title },
      });
      expect(res.form.id).toBe(TEST_ID);
      expect(res.form.name).toBe(testForm.title);
      expect(res.form.config.title).toBe(testForm.title);
    });
  });

  describe("GET /api/forms/[id]", () => {
    it("returns the saved form config", async () => {
      const config = await $fetch<JSONFormConfig>(`/api/forms/${TEST_ID}`);
      expect(config.id).toBe(TEST_ID);
      expect(config.title).toBe(testForm.title);
    });

    it("returns 404 for unknown id", async () => {
      await expect($fetch("/api/forms/does-not-exist-xyz")).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe("DELETE /api/forms/[id]", () => {
    it("deletes the form and returns success", async () => {
      const res = await $fetch<{ success: boolean }>(`/api/forms/${TEST_ID}`, {
        method: "DELETE",
      });
      expect(res.success).toBe(true);
    });

    it("returns 404 after deletion", async () => {
      await expect($fetch(`/api/forms/${TEST_ID}`)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
