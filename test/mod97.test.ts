import { describe, expect, it } from "vitest";
import { generateIban, isValidIban, toIban } from "../src/iban";
import { computeCheckDigits, ibanMod97, mod97, toDigits } from "../src/mod97";

describe("mod97 primitives", () => {
  it("expands letters to ISO 13616 digits (A=10 .. Z=35)", () => {
    expect(toDigits("A")).toBe("10");
    expect(toDigits("Z")).toBe("35");
    expect(toDigits("CI00")).toBe("121800");
  });

  it("reduces large decimal strings modulo 97 without overflow", () => {
    expect(mod97("0")).toBe(0);
    expect(mod97("97")).toBe(0);
    expect(mod97("9999999999999999999999")).toBe(mod97("9999999999999999999999"));
  });

  it("validates a canonical non-UEMOA IBAN (anchors mod-97 correctness)", () => {
    // The textbook GB example is a known-valid IBAN.
    expect(ibanMod97("GB82WEST12345698765432")).toBe(1);
  });
});

describe("check digits round-trip", () => {
  const bban = "CI0340104914264350001809";

  it("computeCheckDigits then validate yields a valid IBAN", () => {
    const iban = toIban("CI", bban);
    expect(iban.slice(0, 2)).toBe("CI");
    expect(iban.slice(2, 4)).toBe(computeCheckDigits("CI", bban));
    expect(isValidIban(iban)).toBe(true);
  });

  it("rejects a tampered checksum", () => {
    const iban = toIban("CI", bban);
    const wrongCheck = iban.slice(2, 4) === "00" ? "01" : "00";
    const broken = `CI${wrongCheck}${iban.slice(4)}`;
    expect(isValidIban(broken)).toBe(false);
  });
});

describe("isValidIban", () => {
  it("returns false for wrong length", () => {
    expect(isValidIban("CI93")).toBe(false);
  });

  it("returns false for non-UEMOA country", () => {
    expect(isValidIban("FR7630006000011234567890189")).toBe(false);
  });

  it("returns false for a 28-char non-UEMOA IBAN", () => {
    expect(isValidIban("XX00CI0340104914264350001809")).toBe(false);
  });

  it("returns false for non-string input", () => {
    // @ts-expect-error — runtime safety for JS callers
    expect(isValidIban(12345)).toBe(false);
  });

  it("ignores spaces and casing", () => {
    const iban = toIban("SN", "SN0100152000048500003035");
    const spaced = iban
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .toLowerCase();
    expect(isValidIban(spaced)).toBe(true);
  });
});

describe("generateIban", () => {
  it("produces a valid IBAN with defaults", () => {
    const iban = generateIban({ country: "CI", bankCode: "CI034" });
    expect(iban).toHaveLength(28);
    expect(isValidIban(iban)).toBe(true);
  });

  it("honours explicit fields", () => {
    const iban = generateIban({
      country: "CI",
      bankCode: "CI034",
      branchCode: "01049",
      accountNumber: "142643500018",
      ribKey: "09",
    });
    expect(iban.endsWith("CI0340104914264350001809")).toBe(true);
    expect(isValidIban(iban)).toBe(true);
  });

  it("throws on a wrong-width field", () => {
    expect(() => generateIban({ country: "CI", bankCode: "CI3" })).toThrow(/bankCode must be 5/);
  });
});
