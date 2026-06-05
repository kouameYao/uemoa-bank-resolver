import { describe, expect, it } from "vitest";
import { toIban } from "../src/iban";
import { identifyBank } from "../src/index";

describe("identifyBank", () => {
  it("identifies the bank from a valid IBAN", () => {
    const iban = toIban("CI", "CI0080104900000000000000".slice(0, 24));
    const r = identifyBank(iban);
    expect(r.country).toBe("CI");
    expect(r.isIban).toBe(true);
    expect(r.ibanValid).toBe(true);
    expect(r.parts?.bankCode).toBe("CI008");
    expect(r.bank?.shortName).toBe("SGCI");
  });

  it("decomposes the documented Banque Atlantique CI example", () => {
    const r = identifyBank("CI93 CI034 01049 142643500018 09");
    expect(r.parts?.branchCode).toBe("01049");
    expect(r.parts?.accountNumber).toBe("142643500018");
    expect(r.bank?.shortName).toBe("BACI");
  });

  it("works on a raw RIB (no IBAN prefix, no checksum)", () => {
    const r = identifyBank("CI0080104900000000000000".slice(0, 24));
    expect(r.isIban).toBe(false);
    expect(r.ibanValid).toBeNull();
    expect(r.country).toBe("CI");
    expect(r.bank?.shortName).toBe("SGCI");
    expect(r.warnings.join(" ")).toContain("Raw RIB");
  });

  it("flags an invalid IBAN checksum as an error", () => {
    const r = identifyBank("CI00CI0340104914264350001809");
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toContain("mod-97");
  });

  it("reports a structural error without throwing", () => {
    const r = identifyBank("NOT-AN-IBAN");
    expect(r.valid).toBe(false);
    expect(r.parts).toBeNull();
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("handles non-string input defensively", () => {
    // @ts-expect-error — runtime safety for JS callers
    const r = identifyBank(undefined);
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("Input must be a string");
    expect(r.parts).toBeNull();
  });

  it("rejects an empty string without throwing", () => {
    const r = identifyBank("");
    expect(r.valid).toBe(false);
    expect(r.parts).toBeNull();
  });

  it("flags a malformed field (letters in the branch code)", () => {
    // 24-char RIB with a letter inside the branch code segment.
    const r = identifyBank("CI0340104A14264350001809");
    expect(r.valid).toBe(false);
    expect(r.parts).not.toBeNull();
    expect(r.errors.join(" ")).toContain("branch code");
  });

  it("warns (not errors) when the bank code is unknown", () => {
    const iban = toIban("CI", "CI9990104900000000000000".slice(0, 24));
    const r = identifyBank(iban);
    expect(r.ibanValid).toBe(true);
    expect(r.bank).toBeNull();
    expect(r.warnings.join(" ")).toContain("Unknown bank code");
  });
});
