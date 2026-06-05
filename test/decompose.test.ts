import { describe, expect, it } from "vitest";
import { decompose, InvalidFormatError } from "../src/decompose";

describe("decompose", () => {
  it("parses a full IBAN (real Côte d'Ivoire example)", () => {
    const p = decompose("CI93 CI034 01049 142643500018 09");
    expect(p).toEqual({
      countryCode: "CI",
      checkDigits: "93",
      bankCode: "CI034",
      branchCode: "01049",
      accountNumber: "142643500018",
      ribKey: "09",
      bban: "CI0340104914264350001809",
    });
  });

  it("parses a raw RIB (no IBAN prefix) and derives the country", () => {
    const p = decompose("CI0340104914264350001809");
    expect(p.countryCode).toBe("CI");
    expect(p.checkDigits).toBeNull();
    expect(p.bankCode).toBe("CI034");
    expect(p.ribKey).toBe("09");
  });

  it("tolerates separators and lower case", () => {
    const p = decompose("ci93-ci03.4 0104 9142 6435 0001 809");
    expect(p.bankCode).toBe("CI034");
  });

  it("throws on unexpected length", () => {
    expect(() => decompose("CI93CI034")).toThrow(InvalidFormatError);
  });

  it("throws on a non-UEMOA country prefix", () => {
    expect(() => decompose("FR7630006000011234567890189")).toThrow(InvalidFormatError);
  });

  it("throws on a 28-char IBAN whose country is not UEMOA", () => {
    expect(() => decompose("XX00CI0340104914264350001809")).toThrow(InvalidFormatError);
  });

  it("throws on non-numeric IBAN check digits", () => {
    expect(() => decompose("CIABCI0340104914264350001809")).toThrow(/check digits/);
  });

  it("throws on a 24-char RIB whose prefix is not UEMOA", () => {
    expect(() => decompose("XX0340104914264350001809")).toThrow(InvalidFormatError);
  });
});
