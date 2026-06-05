import type { CountryCode } from "./types";

/**
 * Field widths of the UEMOA BBAN (a.k.a. RIB), in characters.
 * Total = 24. With the 4-character IBAN prefix the IBAN is 28 characters.
 */
export const FIELD = {
  BANK: 5,
  BRANCH: 5,
  ACCOUNT: 12,
  KEY: 2,
} as const;

export const BBAN_LENGTH = FIELD.BANK + FIELD.BRANCH + FIELD.ACCOUNT + FIELD.KEY; // 24
export const IBAN_PREFIX_LENGTH = 4; // country code (2) + check digits (2)
export const IBAN_LENGTH = IBAN_PREFIX_LENGTH + BBAN_LENGTH; // 28

/**
 * The 8 member states of the UEMOA (Union Économique et Monétaire Ouest-Africaine),
 * whose central bank is the BCEAO. All share the same 28-character IBAN structure.
 */
export const UEMOA_COUNTRIES: Record<CountryCode, string> = {
  BJ: "Bénin",
  BF: "Burkina Faso",
  CI: "Côte d'Ivoire",
  GW: "Guinée-Bissau",
  ML: "Mali",
  NE: "Niger",
  SN: "Sénégal",
  TG: "Togo",
};

const COUNTRY_CODES = Object.keys(UEMOA_COUNTRIES) as CountryCode[];

/** Type guard: is `value` one of the 8 UEMOA ISO country codes? */
export function isUemoaCountry(value: string): value is CountryCode {
  return (COUNTRY_CODES as string[]).includes(value);
}
