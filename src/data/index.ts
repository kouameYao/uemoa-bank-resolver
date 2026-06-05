import type { Bank, CountryCode } from "../types";
import { REGISTRY, type RegistryRow } from "./registry";

/**
 * The legacy single-letter country prefix used in BCEAO registration numbers,
 * mapped to its ISO country code. Used to catch transcription errors at load time.
 */
const REGISTRATION_LETTER: Record<CountryCode, string> = {
  CI: "A",
  BJ: "B",
  BF: "C",
  ML: "D",
  NE: "H",
  SN: "K",
  GW: "S",
  TG: "T",
};

/**
 * Derive the 5-character RIB / IBAN bank code from a BCEAO registration number.
 *
 * The BCEAO reform replaced the legacy single-letter country prefix with the
 * 2-letter ISO code, keeping the code 5 characters long:
 * `ISO(2) + registration number on 3 digits`.
 *
 * @example
 * deriveBankCode("CI", "A 0008 D") // "CI008"  (Société Générale Côte d'Ivoire)
 * deriveBankCode("SN", "K 0011 B") // "SN011"  (Société Générale Sénégal)
 */
export function deriveBankCode(country: string, registration: string): string {
  const expectedLetter = REGISTRATION_LETTER[country as CountryCode];
  const actualLetter = registration.trim().charAt(0).toUpperCase();
  if (expectedLetter && actualLetter !== expectedLetter) {
    throw new Error(
      `Registration "${registration}" starts with "${actualLetter}" but ${country} ` +
        `expects "${expectedLetter}" — likely a transcription error`,
    );
  }
  const digits = registration.replace(/\D/g, "");
  if (digits.length === 0) {
    throw new Error(`Registration number has no digits: "${registration}"`);
  }
  const n = Number.parseInt(digits, 10);
  if (n > 999) {
    throw new Error(
      `Registration number ${n} exceeds 3 digits; bank code would not fit 5 characters: "${registration}"`,
    );
  }
  return country + String(n).padStart(3, "0");
}

function toBank(row: RegistryRow): Bank {
  return {
    country: row.country,
    bankCode: deriveBankCode(row.country, row.registration),
    registration: row.registration,
    name: row.name,
    shortName: row.shortName,
    type: row.type,
    presence: row.presence,
    bic: row.bic ?? null,
    logo: row.logo ?? null,
  };
}

/** All institutions, with their derived bank codes. */
export const BANKS: readonly Bank[] = REGISTRY.map(toBank);

/** Lookup index keyed by `${country}:${bankCode}` (both kept upper-cased). */
const INDEX: ReadonlyMap<string, Bank> = (() => {
  const map = new Map<string, Bank>();
  for (const bank of BANKS) {
    const key = `${bank.country}:${bank.bankCode}`;
    if (map.has(key)) {
      throw new Error(`Duplicate bank code detected: ${key} (${bank.name})`);
    }
    map.set(key, bank);
  }
  return map;
})();

/** Internal: resolve a bank by country + bank code. Returns `null` if unknown. */
export function findBank(country: string, bankCode: string): Bank | null {
  return INDEX.get(`${country.toUpperCase()}:${bankCode.toUpperCase()}`) ?? null;
}
