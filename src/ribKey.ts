/**
 * RIB key (clé RIB) computation for UEMOA / BCEAO accounts.
 *
 * The clé is the 2-digit complement to 97 of the full BBAN — bank code, branch
 * code and account number concatenated with the key positions set to `00` —
 * interpreted as a single integer (letters folded to digits via the standard
 * RIB table below), taken mod 97:
 *
 *   key = 97 - ((bankDigits ++ branchCode ++ accountNumber ++ "00") mod 97)
 *
 * This differs from the classic French formula (`97 - (89·B + 15·G + 3·C) mod 97`),
 * which does NOT match BCEAO keys for ISO-prefixed bank codes. The formula here
 * is verified against known-real IBANs whose mod-97 checksum is authoritative:
 *   - `CI93 CI034 01049 142643500018 09` → clé 09 ✓
 *   - `CI93 CI008 01122 012248782424 10` → clé 22 ✓
 *
 * It is used as an integrity check by `identifyBank` (reported via `ribKeyValid`),
 * {@link isValidRib} and {@link generateIban}. For an IBAN, the mod-97 checksum
 * (see {@link isValidIban}) remains the authoritative end-to-end integrity check;
 * the clé RIB is the equivalent control when only a raw BBAN is available.
 */

// A,J -> 1 ; B,K,S -> 2 ; C,L,T -> 3 ; ... I,R,Z -> 9
const LETTER_TO_DIGIT: Record<string, string> = {
  A: "1",
  J: "1",
  B: "2",
  K: "2",
  S: "2",
  C: "3",
  L: "3",
  T: "3",
  D: "4",
  M: "4",
  U: "4",
  E: "5",
  N: "5",
  V: "5",
  F: "6",
  O: "6",
  W: "6",
  G: "7",
  P: "7",
  X: "7",
  H: "8",
  Q: "8",
  Y: "8",
  I: "9",
  R: "9",
  Z: "9",
};

function lettersToDigits(value: string): string {
  let out = "";
  for (const ch of value.toUpperCase()) {
    if (ch >= "0" && ch <= "9") out += ch;
    else out += LETTER_TO_DIGIT[ch] ?? "0";
  }
  return out;
}

/** Compute the expected 2-digit RIB key for the given RIB components. */
export function computeRibKey(bankCode: string, branchCode: string, accountNumber: string): string {
  // Whole BBAN with the key positions zeroed, letters folded to digits.
  const bbanDigits = `${lettersToDigits(bankCode + branchCode + accountNumber)}00`;
  const remainder = BigInt(bbanDigits) % 97n;
  const key = 97n - remainder; // range 1..97
  return key.toString().padStart(2, "0");
}

/** Best-effort check that a RIB key matches its components. */
export function isValidRibKey(
  bankCode: string,
  branchCode: string,
  accountNumber: string,
  ribKey: string,
): boolean {
  return computeRibKey(bankCode, branchCode, accountNumber) === ribKey;
}
