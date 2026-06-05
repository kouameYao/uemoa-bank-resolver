/**
 * ISO 3166-1 alpha-2 codes of the 8 UEMOA / BCEAO member states.
 */
export type CountryCode = "BJ" | "BF" | "CI" | "GW" | "ML" | "NE" | "SN" | "TG";

/**
 * Kind of credit institution.
 * - `bank`: établissement bancaire
 * - `financial`: établissement financier à caractère bancaire
 */
export type InstitutionType = "bank" | "financial";

/**
 * Whether the institution is a local subsidiary (`filiale`) or a branch
 * (`succursale`) of an institution headquartered in another UEMOA state.
 */
export type Presence = "filiale" | "succursale";

/**
 * A credit institution of the UEMOA zone.
 */
export interface Bank {
  /** ISO country code of the institution. */
  country: CountryCode;
  /** 5-character bank code used in RIB / IBAN, e.g. `"CI008"`. */
  bankCode: string;
  /** Official BCEAO registration number ("numéro d'inscription"), e.g. `"A 0008 D"`. */
  registration: string;
  /** Full legal name. */
  name: string;
  /** Common acronym / short name, when known. */
  shortName?: string;
  type: InstitutionType;
  presence?: Presence;
  /** BIC / SWIFT code. Optional — fill from your own source. */
  bic?: string | null;
  /** Logo URL or local path. Optional — fill from your own source. */
  logo?: string | null;
}

/**
 * The structured components of a UEMOA RIB / IBAN.
 */
export interface IbanParts {
  /** Country code: from the IBAN prefix, or derived from the bank code for a raw RIB. */
  countryCode: CountryCode;
  /** IBAN check digits (2 chars). `null` when the input was a raw RIB (no IBAN prefix). */
  checkDigits: string | null;
  /** 5-character bank code (code banque), e.g. `"CI008"`. */
  bankCode: string;
  /** 5-character branch code (code guichet). */
  branchCode: string;
  /** 12-character account number (numéro de compte). */
  accountNumber: string;
  /** 2-character RIB key (clé RIB). */
  ribKey: string;
  /** The 24-character BBAN (RIB without the IBAN prefix). */
  bban: string;
}

/**
 * The full result of {@link identifyBank}.
 */
export interface ResolveResult {
  /** The raw input as provided. */
  input: string;
  /** The cleaned input (spaces removed, upper-cased). */
  normalized: string;
  /** `true` when the input carried an IBAN prefix (country code + check digits). */
  isIban: boolean;
  /** Overall validity: structure OK and, for IBAN input, mod-97 OK. */
  valid: boolean;
  /** Hard errors that make the input invalid. */
  errors: string[];
  /** Non-blocking observations (e.g. best-effort RIB key mismatch, unknown bank). */
  warnings: string[];
  /** Detected country, or `null` when undeterminable. */
  country: CountryCode | null;
  /** Decomposed parts, or `null` when the structure could not be parsed. */
  parts: IbanParts | null;
  /** IBAN mod-97 result. `null` for raw RIB input (no check digits to verify). */
  ibanValid: boolean | null;
  /** Best-effort RIB key check. `null` when not computed. See README caveats. */
  ribKeyValid: boolean | null;
  /** The matched bank, or `null` when the bank code is unknown. */
  bank: Bank | null;
}
