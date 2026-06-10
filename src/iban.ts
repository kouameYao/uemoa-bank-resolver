import { FIELD, IBAN_LENGTH } from "./constants";
import { decompose, InvalidFormatError } from "./decompose";
import { computeCheckDigits, ibanMod97 } from "./mod97";
import { normalize } from "./normalize";
import { computeRibKey } from "./ribKey";

/**
 * Validate a UEMOA IBAN: correct length, known country, and ISO 13616 mod-97
 * checksum equal to 1. Returns `false` (never throws) for any malformed input.
 */
export function isValidIban(input: string): boolean {
  const value = normalize(input);
  if (value.length !== IBAN_LENGTH) return false;
  try {
    decompose(value);
  } catch (error) {
    if (error instanceof InvalidFormatError) return false;
    throw error;
  }
  return ibanMod97(value) === 1;
}

/**
 * Build a valid IBAN from a country code and a 24-character BBAN by computing
 * the correct check digits. Useful to turn a raw RIB into a printable IBAN.
 *
 * @example
 * toIban("CI", "CI0340104914264350001809") // "CI93CI0340104914264350001809"
 */
export function toIban(countryCode: string, bban: string): string {
  const cc = countryCode.toUpperCase();
  const cleanBban = normalize(bban);
  const check = computeCheckDigits(cc, cleanBban);
  return cc + check + cleanBban;
}

export interface GenerateIbanOptions {
  /** ISO country code, e.g. "CI". */
  country: string;
  /** 5-character bank code, e.g. "CI034". */
  bankCode: string;
  /** 5-digit branch code. Default "00000". */
  branchCode?: string;
  /** 12-digit account number. Default twelve zeros. */
  accountNumber?: string;
  /** 2-digit RIB key. Default: computed with {@link computeRibKey}. */
  ribKey?: string;
}

/**
 * Generate a UEMOA IBAN with a **valid mod-97 checksum**, for tests and fixtures.
 *
 * When `ribKey` is omitted it is computed so the fixture is self-consistent for
 * both the IBAN checksum and the clé RIB. Pass `ribKey` explicitly to force a
 * specific (possibly invalid) key.
 *
 * @example
 * generateIban({ country: "CI", bankCode: "CI034", branchCode: "01049" });
 */
export function generateIban(options: GenerateIbanOptions): string {
  const country = options.country.toUpperCase();
  const bankCode = options.bankCode.toUpperCase();
  const branchCode = options.branchCode ?? "0".repeat(FIELD.BRANCH);
  const accountNumber = options.accountNumber ?? "0".repeat(FIELD.ACCOUNT);
  const ribKey = options.ribKey ?? computeRibKey(bankCode, branchCode, accountNumber);

  const fields: Array<[string, string, number]> = [
    ["bankCode", bankCode, FIELD.BANK],
    ["branchCode", branchCode, FIELD.BRANCH],
    ["accountNumber", accountNumber, FIELD.ACCOUNT],
    ["ribKey", ribKey, FIELD.KEY],
  ];
  for (const [field, value, width] of fields) {
    if (value.length !== width) {
      throw new Error(`generateIban: ${field} must be ${width} characters, got "${value}"`);
    }
  }

  return toIban(country, bankCode + branchCode + accountNumber + ribKey);
}
