import { describe, expect, it } from "vitest";
import { formatIban, formatParts } from "../src/format";

describe("formatParts", () => {
  it("groups an IBAN into semantic parts", () => {
    expect(formatParts("CI93CI0340104914264350001809")).toBe("CI93 CI034 01049 142643500018 09");
  });

  it("omits the prefix for a raw RIB", () => {
    expect(formatParts("CI0340104914264350001809")).toBe("CI034 01049 142643500018 09");
  });

  it("accepts a custom separator", () => {
    expect(formatParts("CI0340104914264350001809", "-")).toBe("CI034-01049-142643500018-09");
  });
});

describe("formatIban", () => {
  it("prints blocks of four like a bank statement", () => {
    expect(formatIban("CI93CI0340104914264350001809")).toBe("CI93 CI03 4010 4914 2643 5000 1809");
  });

  it("formats a raw RIB (no IBAN prefix) in blocks of four", () => {
    expect(formatIban("CI0340104914264350001809")).toBe("CI03 4010 4914 2643 5000 1809");
  });
});
