import { BBAN_LENGTH, FIELD, IBAN_LENGTH, IBAN_PREFIX_LENGTH, isUemoaCountry } from "./constants";
import { normalize } from "./normalize";
import type { CountryCode, IbanParts } from "./types";

/** Thrown by {@link decompose} when the input cannot be structurally parsed. */
export class InvalidFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFormatError";
  }
}

function splitBban(bban: string): Omit<IbanParts, "countryCode" | "checkDigits" | "bban"> {
  const bankEnd = FIELD.BANK;
  const branchEnd = bankEnd + FIELD.BRANCH;
  const accountEnd = branchEnd + FIELD.ACCOUNT;
  const keyEnd = accountEnd + FIELD.KEY;
  return {
    bankCode: bban.slice(0, bankEnd),
    branchCode: bban.slice(bankEnd, branchEnd),
    accountNumber: bban.slice(branchEnd, accountEnd),
    ribKey: bban.slice(accountEnd, keyEnd),
  };
}

/**
 * Parse a UEMOA IBAN **or** raw RIB into its structured components.
 *
 * Accepts either form (spaces/separators are ignored):
 * - a 28-character IBAN: `CC` + 2 check digits + 24-character BBAN
 * - a 24-character RIB (BBAN only): bank code starts with the ISO country letters
 *
 * @throws {InvalidFormatError} when the length or country prefix is not a valid
 *   UEMOA shape.
 *
 * @example
 * decompose("CI93 CI034 01049 142643500018 09")
 * { countryCode: "CI", checkDigits: "93", bankCode: "CI034",
 * branchCode: "01049", accountNumber: "142643500018", ribKey: "09", bban: "..." }
 */
export function decompose(input: string): IbanParts {
  const value = normalize(input);

  if (value.length === IBAN_LENGTH) {
    const countryCode = value.slice(0, 2);
    const checkDigits = value.slice(2, IBAN_PREFIX_LENGTH);
    const bban = value.slice(IBAN_PREFIX_LENGTH);

    if (!isUemoaCountry(countryCode)) {
      throw new InvalidFormatError(`"${countryCode}" is not a UEMOA country code`);
    }
    if (!/^\d{2}$/.test(checkDigits)) {
      throw new InvalidFormatError(`IBAN check digits are not numeric: "${checkDigits}"`);
    }
    return { countryCode, checkDigits, bban, ...splitBban(bban) };
  }

  if (value.length === BBAN_LENGTH) {
    const countryCode = value.slice(0, 2);
    if (!isUemoaCountry(countryCode)) {
      throw new InvalidFormatError(
        `RIB bank code must start with a UEMOA country code; got "${countryCode}"`,
      );
    }
    return {
      countryCode: countryCode as CountryCode,
      checkDigits: null,
      bban: value,
      ...splitBban(value),
    };
  }

  throw new InvalidFormatError(
    `Unexpected length ${value.length}: a UEMOA IBAN is ${IBAN_LENGTH} chars, a RIB is ${BBAN_LENGTH} chars`,
  );
}
