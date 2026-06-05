# uemoa-bank-resolver

[![npm version](https://img.shields.io/npm/v/uemoa-bank-resolver.svg)](https://www.npmjs.com/package/uemoa-bank-resolver)
[![types](https://img.shields.io/npm/types/uemoa-bank-resolver.svg)](https://www.npmjs.com/package/uemoa-bank-resolver)
[![license](https://img.shields.io/npm/l/uemoa-bank-resolver.svg)](./LICENSE)

Validate, decompose, and identify the bank behind any **UEMOA / BCEAO** IBAN or RIB. Offline, fully typed, **zero runtime dependencies**.

Zone couverte : 🇧🇯 Bénin · 🇧🇫 Burkina Faso · 🇨🇮 Côte d'Ivoire · 🇬🇼 Guinée-Bissau · 🇲🇱 Mali · 🇳🇪 Niger · 🇸🇳 Sénégal · 🇹🇬 Togo.

## Installation

```bash
npm install uemoa-bank-resolver
```

Node ≥ 18 · ESM + CommonJS · types inclus.

## Usage

```ts
import { identifyBank } from "uemoa-bank-resolver";

const r = identifyBank("CI93 CI034 01049 142643500018 09");

r.valid; // true
r.country; // "CI"
r.bank?.name; // "Banque Atlantique Côte d'Ivoire"
r.parts?.bankCode; // "CI034"
r.parts?.branchCode; // "01049"
```

L'entrée accepte un **IBAN** (28 car.) ou un **RIB brut** (24 car.), avec ou sans séparateurs.

## API

### `identifyBank(input: string): ResolveResult`

Point d'entrée principal. Ne lève jamais d'exception ; les erreurs sont remontées dans `errors`.

```ts
interface ResolveResult {
  input: string;
  normalized: string;
  isIban: boolean;
  valid: boolean; // structure OK + (pour un IBAN) checksum mod-97 OK
  errors: string[];
  warnings: string[];
  country: CountryCode | null;
  parts: IbanParts | null;
  ibanValid: boolean | null; // mod-97 ; null pour un RIB brut
  ribKeyValid: boolean | null; // null (voir Notes)
  bank: Bank | null;
}
```

### Fonctions

| Fonction                                | Retour            | Description                                            |
| --------------------------------------- | ----------------- | ------------------------------------------------------ |
| `identifyBank(input)`                   | `ResolveResult`   | Validation + décomposition + identification.           |
| `isValidIban(input)`                    | `boolean`         | Longueur, pays et checksum mod-97 (ISO 13616).         |
| `decompose(input)`                      | `IbanParts`       | Découpe en champs nommés (jette `InvalidFormatError`). |
| `lookupBank(country, bankCode)`         | `Bank \| null`    | Recherche par pays + code banque.                      |
| `getLogoUrl(bank \| domain, opts?)`     | `string \| null`  | URL du logo via un service (à partir du domaine).      |
| `getBanksByCountry(country)`            | `Bank[]`          | Institutions d'un pays.                                |
| `listBanks()`                           | `readonly Bank[]` | Les 161 institutions.                                  |
| `formatParts(input, sep?)`              | `string`          | `"CI93 CI034 01049 142643500018 09"`.                  |
| `formatIban(input, sep?)`               | `string`          | `"CI93 CI03 4010 4914 2643 5000 1809"`.                |
| `toIban(country, bban)`                 | `string`          | RIB → IBAN (calcule la clé).                           |
| `generateIban(options)`                 | `string`          | IBAN de test au checksum valide.                       |
| `deriveBankCode(country, registration)` | `string`          | `("CI","A 0008 D") → "CI008"`.                         |

### Types

```ts
type CountryCode = "BJ" | "BF" | "CI" | "GW" | "ML" | "NE" | "SN" | "TG";

interface IbanParts {
  countryCode: CountryCode;
  checkDigits: string | null; // null pour un RIB brut
  bankCode: string; // "CI034"
  branchCode: string; // guichet
  accountNumber: string;
  ribKey: string;
  bban: string; // 24 caractères
}

interface Bank {
  country: CountryCode;
  bankCode: string; // "CI034"  (ISO pays + 3 chiffres)
  registration: string; // "A 0034 G"  (n° d'inscription BCEAO)
  name: string;
  shortName?: string;
  type: "bank" | "financial";
  presence?: "filiale" | "succursale";
  bic?: string | null;
  website?: string | null;     // domaine officiel, ex. "ecobank.com"
  logo?: string | null;        // URL explicite (sinon, utiliser getLogoUrl)
}
```

### Logos

```ts
import { getLogoUrl, lookupBank } from "uemoa-bank-resolver";

getLogoUrl(lookupBank("CI", "CI059"));                 // favicon Ecobank (Google, défaut)
getLogoUrl("societegenerale.ci", { provider: "clearbit", size: 256 });
getLogoUrl(bank, { provider: "logodev", token: "pk_..." });
```

Aucun logo n'est embarqué (marques déposées). `getLogoUrl` construit l'URL depuis le **domaine** de la banque via un service tiers — providers : `google` (défaut, sans clé), `duckduckgo`, `clearbit`, `logodev`/`brandfetch` (avec `token`).

## Format

IBAN UEMOA = `pays(2) + clé IBAN(2) + BBAN(24)` = **28 caractères**.
BBAN (RIB) = `code banque(5) + guichet(5) + compte(12) + clé RIB(2)` = **24**.
Le code banque vaut `ISO pays + 3 chiffres` (`CI034`), dérivé du n° d'inscription BCEAO.

## Données

161 établissements de crédit (136 banques + 25 établissements financiers) — source : **BCEAO / Commission Bancaire de l'UMOA, 31 décembre 2025**.

- `bic` renseigné pour ~90 établissements (annuaires SWIFT publics, rapprochés par nom) — **communautaire, à vérifier** avant un virement.
- `website` (domaine officiel) renseigné pour les grands groupes — **curé et partiel**, à compléter. Alimente `getLogoUrl`.
- Aucun **logo** n'est embarqué (marques déposées) : utilisez `getLogoUrl`.

## Notes

- La somme de contrôle fiable d'un IBAN est le **checksum mod-97**. Un **RIB brut** (sans préfixe IBAN) n'a pas de checksum : seule sa structure est validée.
- La **clé RIB** (`ribKeyValid`) n'est pas vérifiée : l'algorithme BCEAO pour les codes banque préfixés ISO n'est pas confirmé. `computeRibKey` / `isValidRibKey` sont exportées à titre expérimental.
- Données datées : pensez à mettre à jour la base (cf. `CONTRIBUTING.md`).

## License

[MIT](./LICENSE) © Jean Kouamé
