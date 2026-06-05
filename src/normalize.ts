/**
 * Normalize an IBAN / RIB string for processing:
 * remove every character that is not a letter or digit, then upper-case.
 *
 * Handles spaces, tabs, dots, dashes and any other separator a user might paste.
 *
 * @example
 * normalize("ci93 ci03-4.0104 9142 6435 0001 809") // "CI93CI0340104914264350001809"
 */
export function normalize(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();
}
