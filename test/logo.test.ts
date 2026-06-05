import { describe, expect, it } from "vitest";
import { getLogoUrl } from "../src/logo";
import { lookupBank } from "../src/lookup";

describe("getLogoUrl", () => {
  it("builds a favicon URL from a bank's website (default provider)", () => {
    const bank = lookupBank("CI", "CI059"); // Ecobank CI -> ecobank.com
    expect(getLogoUrl(bank)).toBe("https://www.google.com/s2/favicons?domain=ecobank.com&sz=128");
  });

  it("supports alternative providers and size", () => {
    expect(getLogoUrl("societegenerale.ci", { provider: "clearbit", size: 256 })).toBe(
      "https://logo.clearbit.com/societegenerale.ci?size=256",
    );
    expect(getLogoUrl("ecobank.com", { provider: "duckduckgo" })).toBe(
      "https://icons.duckduckgo.com/ip3/ecobank.com.ico",
    );
  });

  it("injects a token for keyed providers", () => {
    expect(getLogoUrl("ecobank.com", { provider: "logodev", token: "pk_x" })).toContain(
      "token=pk_x",
    );
    expect(getLogoUrl("ecobank.com", { provider: "brandfetch", token: "c_1" })).toBe(
      "https://cdn.brandfetch.io/ecobank.com/w/128/h/128?c=c_1",
    );
  });

  it("prefers an explicit logo over the website", () => {
    expect(getLogoUrl({ logo: "https://cdn/x.svg", website: "ecobank.com" } as never)).toBe(
      "https://cdn/x.svg",
    );
  });

  it("normalizes URLs to bare domains", () => {
    expect(getLogoUrl("https://www.ecobank.com/ci/personal")).toContain("domain=ecobank.com");
  });

  it("returns null when no domain is available", () => {
    expect(getLogoUrl(null)).toBeNull();
    expect(getLogoUrl("")).toBeNull();
    expect(getLogoUrl("not-a-domain")).toBeNull();
    expect(getLogoUrl(lookupBank("CI", "CI211"))).toBeNull(); // Mansa Bank: no website
  });
});
