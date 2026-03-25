import { describe, it, expect } from "vitest";
import { buildConfig, toJSONField, toJSONRow } from "~/utils/form-serializer";
import type { CanvasPage } from "~/pages/builder/config";
import { uid } from "~/utils/canvas-factories";

describe("buildConfig", () => {
  const page: CanvasPage = {
    _id: "p1",
    title: "Step 1",
    sections: [
      {
        _id: "s1",
        title: "Section 1",
        rows: [
          {
            _id: "r1",
            layout: "auto",
            gap: "md",
            fields: [
              { _id: uid(), name: "firstName", label: "First Name", component: "UInput", type: "text", colSpan: 6 },
              { _id: uid(), name: "email", label: "Email", component: "UInput", type: "email", colSpan: 6 },
            ],
          },
        ],
      },
    ],
  };

  it("produces correct top-level shape", () => {
    const config = buildConfig([page], "form-123", "Test Form", false);
    expect(config.id).toBe("form-123");
    expect(config.title).toBe("Test Form");
    expect(config.pages).toHaveLength(1);
  });

  it("omits service_code when empty", () => {
    const config = buildConfig([page], "form-123", "Test Form", false, "");
    expect(config).not.toHaveProperty("service_code");
  });

  it("includes service_code when provided", () => {
    const config = buildConfig([page], "form-123", "Test Form", false, "SVC_001");
    expect(config.service_code).toBe("SVC_001");
  });

  it("strips _id from fields in output", () => {
    const config = buildConfig([page], "form-123", "Test Form", false);
    const fields = config.pages[0].sections![0].rows![0].fields;
    fields.forEach((f) => expect(f).not.toHaveProperty("_id"));
  });

  it("preserves field names and labels", () => {
    const config = buildConfig([page], "form-123", "Test Form", false);
    const fields = config.pages[0].sections![0].rows![0].fields;
    expect(fields[0].name).toBe("firstName");
    expect(fields[1].name).toBe("email");
  });
});
