/**
 * ISO 7064 / ISO 13616 helpers used for IBAN check-digit validation.
 *
 * Letters are converted to numbers: A=10, B=11, ... Z=35. The resulting decimal
 * string is reduced modulo 97 using a chunked algorithm so it never overflows
 * `Number.MAX_SAFE_INTEGER` (no BigInt required).
 */

const A_CHAR_CODE = "A".charCodeAt(0);

/** Convert an alphanumeric IBAN segment to its all-digit ISO 13616 expansion. */
export function toDigits(value: string): string {
  let out = "";
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") {
      out += ch;
    } else {
      // A -> 10, ..., Z -> 35
      out += String(ch.charCodeAt(0) - A_CHAR_CODE + 10);
    }
  }
  return out;
}

/** Compute `BigInt(digits) % 97` without BigInt, processing the string in chunks. */
export function mod97(digits: string): number {
  let remainder = 0;
  for (let i = 0; i < digits.length; i += 7) {
    const chunk = String(remainder) + digits.slice(i, i + 7);
    remainder = Number(chunk) % 97;
  }
  return remainder;
}

/**
 * Rearrange an IBAN per ISO 13616 (move the first 4 chars to the end) and return
 * its mod-97 value. A valid IBAN yields `1`.
 */
export function ibanMod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  return mod97(toDigits(rearranged));
}

/**
 * Compute the 2-digit IBAN check digits for a given country code and BBAN.
 *
 * @example
 * computeCheckDigits("CI", "CI0340104914264350001809") // e.g. "93"
 */
export function computeCheckDigits(countryCode: string, bban: string): string {
  const rearranged = `${bban}${countryCode}00`;
  const remainder = mod97(toDigits(rearranged));
  const check = 98 - remainder;
  return String(check).padStart(2, "0");
}
