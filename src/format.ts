import { decompose } from "./decompose";

/**
 * Format an IBAN / RIB into its semantic groups:
 * `[CC kk] bankCode branchCode accountNumber ribKey`.
 *
 * The IBAN prefix (country + check digits) is included only when present in the
 * input.
 *
 * @example
 * formatParts("CI93CI0340104914264350001809")
 * "CI93 CI034 01049 142643500018 09"
 * formatParts("CI03401049142643500018 09") // raw RIB
 * "CI034 01049 142643500018 09"
 */
export function formatParts(input: string, separator = " "): string {
  const p = decompose(input);
  const groups: string[] = [];
  if (p.checkDigits !== null) groups.push(p.countryCode + p.checkDigits);
  groups.push(p.bankCode, p.branchCode, p.accountNumber, p.ribKey);
  return groups.join(separator);
}

/**
 * Format an IBAN the conventional way banks print it: blocks of 4 characters.
 *
 * @example
 * formatIban("CI93CI0340104914264350001809")
 * "CI93 CI03 4010 4914 2643 5000 1809"
 */
export function formatIban(input: string, separator = " "): string {
  const p = decompose(input);
  const full = (p.checkDigits !== null ? p.countryCode + p.checkDigits : "") + p.bban;
  return (full.match(/.{1,4}/g) ?? []).join(separator);
}
