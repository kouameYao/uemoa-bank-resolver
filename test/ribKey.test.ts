import { describe, expect, it } from "vitest";
import { computeRibKey, isValidRibKey } from "../src/ribKey";

// NOTE: the RIB key check is best-effort (see src/ribKey.ts). These tests pin
// down the format and determinism of the implementation, not its agreement with
// every real-world account. Tighten them once validated against your own data.
describe("computeRibKey", () => {
  it("returns a 2-digit string", () => {
    expect(computeRibKey("CI034", "01049", "142643500018")).toMatch(/^\d{2}$/);
  });

  it("is deterministic", () => {
    const a = computeRibKey("CI008", "01122", "012247878232");
    const b = computeRibKey("CI008", "01122", "012247878232");
    expect(a).toBe(b);
  });

  it("isValidRibKey agrees with computeRibKey", () => {
    const key = computeRibKey("CI034", "01049", "142643500018");
    expect(isValidRibKey("CI034", "01049", "142643500018", key)).toBe(true);
    expect(isValidRibKey("CI034", "01049", "142643500018", "00")).toBe(key === "00");
  });
});
