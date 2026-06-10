import { decompose, InvalidFormatError } from "./decompose";
import { normalize } from "./normalize";
import { isValidRibKey } from "./ribKey";

/**
 * Validate the integrity of a UEMOA RIB via its **clé RIB** (the 2-digit key at
 * positions 23-24) — the RIB counterpart of {@link isValidIban}'s mod-97 check.
 *
 * Accepts either a 24-character RIB (BBAN) **or** a 28-character IBAN (the BBAN is
 * extracted). Spaces and casing are ignored. Returns `false` (never throws) for
 * any malformed input.
 *
 * The clé RIB is checked with the BCEAO mod-97 formula (see {@link computeRibKey}).
 * This validates the BBAN only; when you have a full IBAN, {@link isValidIban}'s
 * mod-97 checksum is the authoritative end-to-end check (it also covers the country
 * code and check digits). Use this when you only have a raw RIB.
 *
 * @example
 * isValidRib("CI008 01122 012248782323 22"); // structure + clé RIB
 */
export function isValidRib(input: string): boolean {
  const value = normalize(input);

  let parts: ReturnType<typeof decompose>;
  try {
    parts = decompose(value);
  } catch (error) {
    if (error instanceof InvalidFormatError) return false;
    throw error;
  }

  // Character-class checks per field (mirror identifyBank's structural checks).
  if (!/^[A-Z]{2}\d{3}$/.test(parts.bankCode)) return false;
  if (!/^\d{5}$/.test(parts.branchCode)) return false;
  if (!/^\d{12}$/.test(parts.accountNumber)) return false;
  if (!/^\d{2}$/.test(parts.ribKey)) return false;

  return isValidRibKey(parts.bankCode, parts.branchCode, parts.accountNumber, parts.ribKey);
}
