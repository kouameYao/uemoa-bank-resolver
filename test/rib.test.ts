import { describe, expect, it } from "vitest";
import { generateIban } from "../src/iban";
import { isValidRib } from "../src/rib";
import { computeRibKey } from "../src/ribKey";

// A self-consistent RIB: generateIban computes the clé RIB by default,
// so its BBAN is a RIB whose key matches its own components.
const validIban = generateIban({ country: "CI", bankCode: "CI034", branchCode: "01049" });
const validRib = validIban.slice(4); // 24-char BBAN

describe("isValidRib", () => {
  it("accepts a RIB whose clé matches its components", () => {
    expect(isValidRib(validRib)).toBe(true);
  });

  it("accepts a full IBAN by validating its embedded BBAN", () => {
    expect(isValidRib(validIban)).toBe(true);
  });

  it("ignores spaces and casing", () => {
    const spaced = validRib
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .toLowerCase();
    expect(isValidRib(spaced)).toBe(true);
  });

  it("rejects a tampered clé RIB", () => {
    const correctKey = validRib.slice(-2);
    const wrongKey = correctKey === "00" ? "01" : "00";
    const tampered = validRib.slice(0, -2) + wrongKey;
    expect(isValidRib(tampered)).toBe(false);
  });

  it("rejects a tampered account number (clé no longer matches)", () => {
    const head = validRib.slice(0, 10); // bank + branch
    const key = validRib.slice(-2);
    const tampered = `${head}999999999999${key}`;
    expect(isValidRib(tampered)).toBe(false);
  });

  it("rejects malformed structure", () => {
    expect(isValidRib("CI034")).toBe(false);
    expect(isValidRib("XX0340104900000000000008")).toBe(false);
  });

  it("rejects non-string input", () => {
    // @ts-expect-error — runtime safety for JS callers
    expect(isValidRib(12345)).toBe(false);
    // @ts-expect-error — runtime safety for JS callers
    expect(isValidRib(null)).toBe(false);
  });

  it("agrees with a hand-built RIB using computeRibKey", () => {
    const bankCode = "CI008";
    const branchCode = "01122";
    const accountNumber = "012247878232";
    const key = computeRibKey(bankCode, branchCode, accountNumber);
    const rib = bankCode + branchCode + accountNumber + key;
    expect(isValidRib(rib)).toBe(true);
  });
});
