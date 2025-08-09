import { describe, it, expect } from "vitest";
import { add } from "../src/index";

describe("add()", () => {
  it("adds positive integers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negatives", () => {
    expect(add(-2, 3)).toBe(1);
    expect(add(-2, -3)).toBe(-5);
  });

  it("handles zero", () => {
    expect(add(0, 0)).toBe(0);
  });
});
