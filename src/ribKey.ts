/**
 * RIB key (clé RIB) computation — ⚠️ UNVERIFIED / EXPERIMENTAL.
 *
 * This implements the classic French formula:
 *   key = 97 - ((89·B + 15·G + 3·C) mod 97)
 * with letters converted to digits via the standard RIB table below.
 *
 * ❗ It does NOT match observed BCEAO keys for ISO-prefixed bank codes. For the
 * real IBAN `CI93 CI034 01049 142643500018 09` (clé = 09) this returns `34`.
 * The exact algorithm the BCEAO uses for the modern code banque is not confirmed.
 *
 * It is therefore NOT used by `identifyBank` and never affects validity. The
 * authoritative integrity check for an IBAN is the mod-97 checksum
 * (see {@link isValidIban}). This is kept exported only as a starting point —
 * contributions that pin down the correct algorithm are welcome.
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
  const b = BigInt(lettersToDigits(bankCode));
  const g = BigInt(lettersToDigits(branchCode));
  const c = BigInt(lettersToDigits(accountNumber));
  const remainder = (89n * b + 15n * g + 3n * c) % 97n;
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
