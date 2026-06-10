import { describe, expect, it } from "vitest";
import { generateIban, isValidIban, toIban } from "../src/iban";
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

  it("validates the clé RIB on a raw RIB", () => {
    // generateIban computes a matching clé RIB by default, so its BBAN is consistent.
    const rib = generateIban({
      country: "CI",
      bankCode: "CI008",
      branchCode: "01049",
    }).slice(4);
    const r = identifyBank(rib);
    expect(r.isIban).toBe(false);
    expect(r.ibanValid).toBeNull();
    expect(r.ribKeyValid).toBe(true);
    expect(r.country).toBe("CI");
    expect(r.bank?.shortName).toBe("SGCI");
    expect(r.warnings.join(" ")).not.toContain("Clé RIB");
  });

  it("warns (non-blocking) when the clé RIB does not match", () => {
    const r = identifyBank("CI0080104900000000000000".slice(0, 24)); // clé "00" — won't match
    expect(r.isIban).toBe(false);
    expect(r.ribKeyValid).toBe(false);
    expect(r.valid).toBe(true); // a clé RIB mismatch is a warning, never blocks validity
    expect(r.warnings.join(" ")).toContain("Clé RIB");
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

  it("rejects an IBAN whose IBAN check digits and clé RIB are both wrong", () => {
    // SGCI bank code, but the "93" check digits and "11" clé RIB are inconsistent
    // with this account number (the correct clé RIB is "22", and once the clé is
    // "22" the original "93" check digits are valid — see the assertions below).
    const r = identifyBank("CI93 CI008 01122 012248782323 11");
    expect(r.isIban).toBe(true);
    expect(r.bank?.shortName).toBe("SGCI");
    expect(r.ibanValid).toBe(false); // mod-97 fails
    expect(r.ribKeyValid).toBe(false); // clé RIB "11" ≠ expected "22"
    expect(r.valid).toBe(false); // mod-97 failure is blocking
    expect(r.errors.join(" ")).toContain("mod-97");

    // Correcting the clé RIB to "22" makes both the clé and the "93" checksum valid.
    expect(isValidIban("CI93CI0080112201224878232322")).toBe(true);
    expect(identifyBank("CI93 CI008 01122 012248782424 10").valid).toBe(true);
  });
});
