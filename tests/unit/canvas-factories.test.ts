import { describe, it, expect } from "vitest";
import { uid, newRow, newSection, newPage } from "~/utils/canvas-factories";

describe("uid", () => {
  it("generates unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()));
    expect(ids.size).toBe(100);
  });

  it("starts with id_", () => {
    expect(uid()).toMatch(/^id_/);
  });
});

describe("newRow", () => {
  it("has auto layout and md gap by default", () => {
    const row = newRow();
    expect(row.layout).toBe("auto");
    expect(row.gap).toBe("md");
    expect(row.fields).toEqual([]);
  });
});

describe("newSection", () => {
  it("sets title and empty rows", () => {
    const section = newSection("Personal Info");
    expect(section.title).toBe("Personal Info");
    expect(section.rows).toEqual([]);
  });

  it("generates a unique _id", () => {
    const a = newSection("A");
    const b = newSection("B");
    expect(a._id).not.toBe(b._id);
  });
});

describe("newPage", () => {
  it("sets title and one empty section", () => {
    const page = newPage("Step 1");
    expect(page.title).toBe("Step 1");
    expect(page.sections).toHaveLength(1);
  });
});
