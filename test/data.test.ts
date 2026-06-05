import { describe, expect, it } from "vitest";
import { BANKS, deriveBankCode } from "../src/data/index";
import { getBanksByCountry, listBanks, lookupBank } from "../src/lookup";

describe("deriveBankCode", () => {
  it("maps registration numbers to ISO+3-digit bank codes", () => {
    expect(deriveBankCode("CI", "A 0008 D")).toBe("CI008"); // SGCI (user's example)
    expect(deriveBankCode("CI", "A 0034 G")).toBe("CI034"); // Banque Atlantique CI
    expect(deriveBankCode("SN", "K 0011 B")).toBe("SN011"); // SG Sénégal
    expect(deriveBankCode("GW", "S 0096 T")).toBe("GW096"); // BAO
  });

  it("handles stray spaces inside the registration", () => {
    expect(deriveBankCode("NE", "H 0 210 K")).toBe("NE210");
  });

  it("throws when the registration has no digits", () => {
    expect(() => deriveBankCode("CI", "A B")).toThrow(/no digits/);
  });

  it("throws when the registration number exceeds 3 digits", () => {
    expect(() => deriveBankCode("CI", "A 1000 X")).toThrow(/exceeds 3 digits/);
  });

  it("throws when the registration letter does not match the country", () => {
    // "B" is Bénin's prefix, not Côte d'Ivoire's ("A").
    expect(() => deriveBankCode("CI", "B 0008 D")).toThrow(/transcription error/);
  });
});

describe("registry integrity", () => {
  it("ships all 161 BCEAO institutions", () => {
    expect(BANKS.length).toBe(161);
  });

  it("has no duplicate country+bankCode pairs", () => {
    const keys = new Set(BANKS.map((b) => `${b.country}:${b.bankCode}`));
    expect(keys.size).toBe(BANKS.length);
  });

  it("every bank code is ISO(2) + 3 digits", () => {
    for (const bank of BANKS) {
      expect(bank.bankCode).toMatch(/^[A-Z]{2}\d{3}$/);
    }
  });
});

describe("lookup", () => {
  it("resolves a known bank", () => {
    const bank = lookupBank("CI", "CI008");
    expect(bank?.name).toBe("Société Générale Côte d'Ivoire");
    expect(bank?.shortName).toBe("SGCI");
  });

  it("is case-insensitive on the code", () => {
    expect(lookupBank("ci", "ci008")?.shortName).toBe("SGCI");
  });

  it("returns null for an unknown code", () => {
    expect(lookupBank("CI", "CI999")).toBeNull();
  });

  it("lists banks per country", () => {
    expect(getBanksByCountry("GW").length).toBe(6);
    expect(getBanksByCountry("CI").length).toBe(33);
  });

  it("exposes the full list", () => {
    expect(listBanks().length).toBe(161);
  });
});

describe("BIC enrichment", () => {
  it("attaches a known BIC", () => {
    expect(lookupBank("CI", "CI008")?.bic).toBe("SGCICIAB");
    expect(lookupBank("SN", "SN011")?.bic).toBe("SGSNSNDA");
  });

  it("every populated BIC is a valid 8-character BIC", () => {
    for (const bank of BANKS) {
      if (bank.bic != null) {
        expect(bank.bic).toMatch(/^[A-Z]{6}[A-Z0-9]{2}$/);
      }
    }
  });

  it("covers a meaningful share of institutions", () => {
    const withBic = BANKS.filter((b) => b.bic != null).length;
    expect(withBic).toBeGreaterThan(80);
  });
});
