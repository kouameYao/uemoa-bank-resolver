# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2026-06-10

### Added

- `isValidRib(input)` — validate a UEMOA RIB via its **clé RIB**: accepts a raw
  24-char RIB (BBAN) or extracts the BBAN from a 28-char IBAN. Structure + clé,
  never throws. The RIB counterpart of `isValidIban`.
- `identifyBank` now reports `ribKeyValid` (computed when every BBAN field is
  well-formed). A clé RIB mismatch is a **non-blocking warning** — the mod-97
  checksum stays authoritative for a full IBAN, while the clé RIB is the available
  integrity signal for a raw BBAN.
- `generateIban` computes a matching clé RIB by default, so fixtures are
  self-consistent for both the checksum and the clé.

### Changed

- The clé RIB now uses the correct BCEAO algorithm — complement to 97 of the full
  BBAN (key positions zeroed), letters folded to digits, taken mod 97 — replacing
  the experimental French formula. Verified against known-real IBANs whose mod-97
  checksum is authoritative.

### Removed

- **Breaking:** `computeRibKey` / `isValidRibKey` are no longer exported (they are
  now internal). Use `isValidRib` instead.

## [0.2.0] - 2026-06-05

### Added

- `getLogoUrl(bank | domain, options?)` — resolve a bank logo URL from its website
  domain via a configurable provider (google/duckduckgo/clearbit/logodev/brandfetch).
  No trademarked images are bundled.
- `Bank.website` field + curated official domains for the major banking groups
  (Ecobank, UBA, Coris, Orabank, Banque Atlantique, CBAO, BGFI, SG, NSIA, BICICI).

## [0.1.1] - 2026-06-05

### Changed

- Docs: minimal, reference-style README (removed dev/publish/onboarding sections).
- Cleaned up badges: registry-backed only (version, downloads, types, license) —
  removed the broken CI badge and the rate-limited bundlephobia badge.

### Internal

- Toolchain bump: Biome 2, Vitest 4, TypeScript 6 (`ignoreDeprecations: "6.0"`).
- `check:exports` moved out of `prepublishOnly` (still enforced in CI).

## [0.1.0] - 2026-06-02

### Added

- Initial release.
- `identifyBank(input)` — validate, decompose and resolve the bank behind a UEMOA IBAN or RIB.
- IBAN validation via ISO 13616 mod-97 (`isValidIban`, `toIban`).
- `generateIban(options)` — build a checksum-valid IBAN for tests/fixtures.
- Structural decomposition (`decompose`) and display helpers (`formatParts`, `formatIban`).
- Offline bank lookup (`lookupBank`, `getBanksByCountry`, `listBanks`) over the
  161 credit institutions of the 8 UEMOA states (BCEAO list, 31 December 2025).
- **BIC codes for ~90 institutions** (major active banks), sourced from public
  SWIFT directories and matched by name. Community-sourced — verify before use.
- Bank-code derivation (`deriveBankCode`) with build-time registration validation.
- Full TypeScript types, dual ESM/CJS build, zero runtime dependencies.

### Notes

- The RIB key (`computeRibKey`, `isValidRibKey`) is exported but **experimental**:
  the exact BCEAO algorithm for ISO-prefixed bank codes is not yet confirmed and it
  is not used by `identifyBank`.
- `bic` is community-sourced (verify before use); `logo` ships empty.

[Unreleased]: https://github.com/kouameYao/uemoa-bank-resolver/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/kouameYao/uemoa-bank-resolver/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kouameYao/uemoa-bank-resolver/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/kouameYao/uemoa-bank-resolver/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/kouameYao/uemoa-bank-resolver/releases/tag/v0.1.0
