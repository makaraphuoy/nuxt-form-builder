import { describe, it, expect } from "vitest";
import { interpretConfig } from "~/utils/form-schema";
import type { JSONFormConfig } from "~/utils/form-schema";

const minimalConfig: JSONFormConfig = {
  id: "form-1",
  title: "Test Form",
  pages: [
    {
      id: "page-1",
      title: "Page 1",
      sections: [
        {
          id: "section-1",
          title: "Section 1",
          rows: [
            {
              id: "row-1",
              layout: "auto",
              gap: "md",
              fields: [
                { name: "fullName", label: "Full Name", component: "UInput", type: "text", colSpan: 12 },
                { name: "age", label: "Age", component: "UInput", type: "number", colSpan: 6 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

describe("interpretConfig", () => {
  it("returns pages array", () => {
    const config = interpretConfig(minimalConfig);
    expect(config.pages).toHaveLength(1);
  });

  it("preserves field names", () => {
    const config = interpretConfig(minimalConfig);
    const fields = config.pages[0].sections![0].rows![0].fields;
    expect(fields.map((f) => f.name)).toEqual(["fullName", "age"]);
  });

  it("handles multi-page config", () => {
    const multi: JSONFormConfig = {
      ...minimalConfig,
      id: "form-multi",
      pages: [
        { ...minimalConfig.pages[0], id: "page-1", title: "Step 1" },
        { id: "page-2", title: "Step 2", sections: [] },
      ],
    };
    const config = interpretConfig(multi);
    expect(config.pages).toHaveLength(2);
  });

  it("accepts service_code without throwing", () => {
    // service_code lives on JSONFormConfig, not on the interpreted runtime config.
    // Pages read it from jsonConfig directly. Just ensure it doesn't throw.
    expect(() =>
      interpretConfig({ ...minimalConfig, service_code: "SVC_X" }),
    ).not.toThrow();
  });
});
