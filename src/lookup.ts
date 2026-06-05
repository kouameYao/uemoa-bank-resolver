import { BANKS, findBank } from "./data/index";
import type { Bank, CountryCode } from "./types";

/**
 * Look up a bank by country code and 5-character bank code.
 * Returns `null` when the code is unknown.
 *
 * @example
 * lookupBank("CI", "CI008") // Société Générale Côte d'Ivoire
 */
export function lookupBank(country: string, bankCode: string): Bank | null {
  return findBank(country, bankCode);
}

/** Return every known institution (banks + financial institutions). */
export function listBanks(): readonly Bank[] {
  return BANKS;
}

/** Return all institutions registered in a given UEMOA country. */
export function getBanksByCountry(country: CountryCode): Bank[] {
  return BANKS.filter((bank) => bank.country === country);
}
