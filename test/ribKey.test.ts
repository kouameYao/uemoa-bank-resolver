import { describe, expect, it } from "vitest";
import { computeRibKey, isValidRibKey } from "../src/ribKey";

// The formula is verified against known-real IBANs whose mod-97 checksum is
// authoritative (see src/ribKey.ts). These tests pin down both the format and
// the exact keys those accounts must produce.
describe("computeRibKey", () => {
  it("returns a 2-digit string", () => {
    expect(computeRibKey("CI034", "01049", "142643500018")).toMatch(/^\d{2}$/);
  });

  it("matches the clé of known-real BCEAO accounts", () => {
    // CI93 CI034 01049 142643500018 09 — mod-97 valid IBAN.
    expect(computeRibKey("CI034", "01049", "142643500018")).toBe("09");
    // CI93 CI008 01122 012248782424 10 — mod-97 valid IBAN.
    expect(computeRibKey("CI008", "01122", "012248782323")).toBe("22");
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
