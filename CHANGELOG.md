# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **BIC codes for ~90 institutions** (all major active banks), sourced from public
  SWIFT directories and matched by name. Community-sourced — verify before use.
- `generateIban(options)` — build a checksum-valid IBAN for tests/fixtures.
- Build-time registry validation: the registration prefix letter must match the
  ISO country (catches transcription errors in `deriveBankCode`).
- `identifyBank` now emits an explicit warning for raw RIB input (structure-only,
  no checksum available).
- Repo hygiene: `SECURITY.md`, issue templates (bug + data correction), PR template.

## [0.1.0] - 2026-06-02

### Added

- Initial release.
- `identifyBank(input)` — validate, decompose and resolve the bank behind a UEMOA IBAN or RIB.
- IBAN validation via ISO 13616 mod-97 (`isValidIban`, `toIban`).
- Structural decomposition (`decompose`) and display helpers (`formatParts`, `formatIban`).
- Offline bank lookup (`lookupBank`, `getBanksByCountry`, `listBanks`) over the
  161 credit institutions of the 8 UEMOA states (BCEAO list, 31 December 2025).
- Bank-code derivation (`deriveBankCode`) from BCEAO registration numbers.
- Full TypeScript types, dual ESM/CJS build, zero runtime dependencies.

### Notes

- The RIB key (clé RIB) check (`computeRibKey`, `isValidRibKey`) is exported but
  **experimental**: the exact BCEAO algorithm for ISO-prefixed bank codes is not
  yet confirmed. It is not used by `identifyBank`.
- `bic` and `logo` fields ship empty — enrich them from your own source.

[Unreleased]: https://github.com/your-org/uemoa-bank-resolver/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/uemoa-bank-resolver/releases/tag/v0.1.0
