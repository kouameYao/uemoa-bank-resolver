import { IBAN_LENGTH } from "./constants";
import { findBank } from "./data/index";
import { decompose, InvalidFormatError } from "./decompose";
import { isValidIban } from "./iban";
import { normalize } from "./normalize";
import type { IbanParts, ResolveResult } from "./types";

/**
 * Identify the bank behind a UEMOA IBAN or RIB, with validation and decomposition.
 *
 * This never throws: malformed input is reported through `valid` / `errors`.
 *
 * @example
 * const r = identifyBank("CI93 CI008 01122 012247878232 19");
 * r.valid;            // true / false
 * r.bank?.name;       // "Société Générale Côte d'Ivoire"
 * r.parts?.branchCode // "01122"
 */
export function identifyBank(input: string): ResolveResult {
  if (typeof input !== "string") {
    return {
      input: String(input ?? ""),
      normalized: "",
      isIban: false,
      valid: false,
      errors: ["Input must be a string"],
      warnings: [],
      country: null,
      parts: null,
      ibanValid: null,
      ribKeyValid: null,
      bank: null,
    };
  }

  const normalized = normalize(input);

  const base = {
    input,
    normalized,
    isIban: normalized.length === IBAN_LENGTH,
  };

  let parts: IbanParts;
  try {
    parts = decompose(normalized);
  } catch (error) {
    if (error instanceof InvalidFormatError) {
      return {
        ...base,
        valid: false,
        errors: [error.message],
        warnings: [],
        country: null,
        parts: null,
        ibanValid: null,
        ribKeyValid: null,
        bank: null,
      };
    }
    throw error;
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Character-class checks per field.
  if (!/^[A-Z]{2}\d{3}$/.test(parts.bankCode)) {
    errors.push(`Malformed bank code "${parts.bankCode}" (expected 2 letters + 3 digits)`);
  }
  if (!/^\d{5}$/.test(parts.branchCode)) {
    errors.push(`Malformed branch code "${parts.branchCode}" (expected 5 digits)`);
  }
  if (!/^\d{12}$/.test(parts.accountNumber)) {
    errors.push(`Malformed account number "${parts.accountNumber}" (expected 12 digits)`);
  }
  if (!/^\d{2}$/.test(parts.ribKey)) {
    errors.push(`Malformed RIB key "${parts.ribKey}" (expected 2 digits)`);
  }

  // IBAN checksum (authoritative when an IBAN prefix is present).
  const isIban = parts.checkDigits !== null;
  let ibanValid: boolean | null = null;
  if (isIban) {
    ibanValid = isValidIban(normalized);
    if (!ibanValid) errors.push("IBAN checksum (mod-97) is invalid");
  } else if (errors.length === 0) {
    // A raw RIB has no IBAN check digits and the clé RIB algorithm is unconfirmed,
    // so only the structure could be verified — be explicit about it.
    warnings.push(
      "Raw RIB: structure only — no checksum available (provide the full IBAN for integrity verification)",
    );
  }

  // RIB key (clé RIB) is intentionally NOT checked automatically: the exact
  // BCEAO algorithm for the modern ISO-prefixed bank codes is not confirmed and
  // the French-style formula does not match observed keys. `computeRibKey` /
  // `isValidRibKey` remain exported for experimentation. See ribKey.ts.
  const ribKeyValid: boolean | null = null;

  const bank = findBank(parts.countryCode, parts.bankCode);
  if (!bank) {
    warnings.push(`Unknown bank code "${parts.bankCode}" for ${parts.countryCode}`);
  }

  return {
    ...base,
    valid: errors.length === 0 && ibanValid !== false,
    errors,
    warnings,
    country: parts.countryCode,
    parts,
    ibanValid,
    ribKeyValid,
    bank,
  };
}

export { BBAN_LENGTH, IBAN_LENGTH, isUemoaCountry, UEMOA_COUNTRIES } from "./constants";
export { BANKS, deriveBankCode } from "./data/index";
export { decompose, InvalidFormatError } from "./decompose";
export { formatIban, formatParts } from "./format";
export { type GenerateIbanOptions, generateIban, isValidIban, toIban } from "./iban";
export { getBanksByCountry, listBanks, lookupBank } from "./lookup";
export { normalize } from "./normalize";
export { computeRibKey, isValidRibKey } from "./ribKey";
export type {
  Bank,
  CountryCode,
  IbanParts,
  InstitutionType,
  Presence,
  ResolveResult,
} from "./types";
