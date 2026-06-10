# uemoa-bank-resolver

**[Issues](https://github.com/kouameYao/uemoa-bank-resolver/issues) · [Discussions](https://github.com/kouameYao/uemoa-bank-resolver/discussions) · [Releases](https://github.com/kouameYao/uemoa-bank-resolver/releases)**

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

## Error Handling

La fonction `identifyBank()` retourne toujours un `ResolveResult`, même en cas d'erreur.

```ts
// ❌ IBAN invalide
const invalid = identifyBank("INVALID");
invalid.valid; // false
invalid.errors; // ["Unexpected length 7: a UEMOA IBAN is 28 chars, a RIB is 24 chars"]

// ✅ Validation en formulaire
if (!isValidRib(userInput)) {
  showError("RIB invalide");
  return;
}

// ⚠️ Gestion des avertissements
const result = identifyBank(iban);
if (result.valid) {
  processPayment(result);
} else if (result.warnings?.length) {
  console.warn("Avertissements:", result.warnings);
} else {
  handleError(result.errors);
}
```

## Examples

### Validation dans un formulaire

```ts
import { identifyBank } from "uemoa-bank-resolver";

const form = {
  validateAndIdentify(iban: string) {
    const result = identifyBank(iban);

    if (!result.valid) {
      return { error: result.errors[0] };
    }

    if (!result.bank) {
      return { error: "Banque non reconnue" };
    }

    return {
      success: true,
      bankName: result.bank.name,
      country: result.country,
    };
  },
};

// Utilisation
const validation = form.validateAndIdentify(userInput);
if (validation.success) {
  console.log("Paiement vers", validation.bankName);
} else {
  showError(validation.error);
}
```

### Afficher le logo de la banque

```ts
import { identifyBank, getLogoUrl } from "uemoa-bank-resolver";

const result = identifyBank(iban);
if (result.bank) {
  const logoUrl = getLogoUrl(result.bank);
  displayBankLogo(logoUrl);
}
```

### Rechercher les banques d'un pays

```ts
import { getBanksByCountry } from "uemoa-bank-resolver";

const senegalBanks = getBanksByCountry("SN");
senegalBanks.forEach((bank) => {
  console.log(`${bank.name} (${bank.bankCode})`);
});
```

## API

### `identifyBank(input: string): ResolveResult`

Point d'entrée principal. Ne lève jamais d'exception ; les erreurs sont remontées dans `errors`.

```ts
interface ResolveResult {
  input: string;
  normalized: string;
  isIban: boolean;
  valid: boolean;
  errors: string[];
  warnings: string[];
  country: CountryCode | null;
  parts: IbanParts | null;
  ibanValid: boolean | null;
  ribKeyValid: boolean | null;
  bank: Bank | null;
}
```

### Fonctions

| Fonction                                | Retour            | Description                                            |
| --------------------------------------- | ----------------- | ------------------------------------------------------ |
| `identifyBank(input)`                   | `ResolveResult`   | Validation + décomposition + identification.           |
| `isValidIban(input)`                    | `boolean`         | IBAN UEMOA : longueur, pays et checksum mod-97.        |
| `isValidRib(input)`                     | `boolean`         | RIB (ou IBAN) : structure + **clé RIB**.               |
| `decompose(input)`                      | `IbanParts`       | Découpe en champs nommés (jette `InvalidFormatError`). |
| `lookupBank(country, bankCode)`         | `Bank \| null`    | Recherche par pays + code banque.                      |
| `getLogoUrl(bank \| domain, opts?)`     | `string \| null`  | URL du logo via un service (à partir du domaine).      |
| `getBanksByCountry(country)`            | `Bank[]`          | Institutions d'un pays.                                |
| `listBanks()`                           | `readonly Bank[]` | Les 161 institutions.                                  |
| `formatParts(input, sep?)`              | `string`          | `"CI93 CI034 01049 142643500018 09"`.                  |
| `formatIban(input, sep?)`               | `string`          | `"CI93 CI03 4010 4914 2643 5000 1809"`.                |
| `normalize(input)`                      | `string`          | Retire espaces/séparateurs et met en majuscules.       |
| `toIban(country, bban)`                 | `string`          | RIB → IBAN (calcule la clé).                           |
| `generateIban(options)`                 | `string`          | IBAN de test au checksum valide.                       |
| `deriveBankCode(country, registration)` | `string`          | `("CI","A 0008 D") → "CI008"`.                         |

### Types

```ts
type CountryCode = "BJ" | "BF" | "CI" | "GW" | "ML" | "NE" | "SN" | "TG";

interface IbanParts {
  countryCode: CountryCode;
  checkDigits: string | null;
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  ribKey: string;
  bban: string;
}

interface GenerateIbanOptions {
  country: string;
  bankCode: string;
  branchCode?: string;
  accountNumber?: string;
  ribKey?: string;
}

interface Bank {
  country: CountryCode;
  bankCode: string;
  registration: string;
  name: string;
  shortName?: string;
  type: "bank" | "financial";
  presence?: "filiale" | "succursale";
  bic?: string | null;
  website?: string | null;
  logo?: string | null;
}
```

### Logos

```ts
import { getLogoUrl, lookupBank } from "uemoa-bank-resolver";

getLogoUrl(lookupBank("CI", "CI059")); // favicon Ecobank (Google, défaut)
getLogoUrl("societegenerale.ci", { provider: "clearbit", size: 256 });
getLogoUrl(bank, { provider: "logodev", token: "pk_..." });
```

Providers : `google` (défaut, sans clé), `duckduckgo`, `clearbit`, `logodev`/`brandfetch` (avec `token`). Aucun logo n'est embarqué.

## Données

161 établissements de crédit — source : **BCEAO / Commission Bancaire de l'UMOA, 31 décembre 2025**. Le champ `bic` est communautaire : **vérifiez-le avant un virement**.

## FAQ

**Q: Puis-je valider hors-ligne ?**
A: Oui, tout fonctionne sans internet. 100% offline.

**Q: Pourquoi mon IBAN valide est rejeté ?**
A: Vérifiez que c'est un IBAN UEMOA (CI, SN, BJ, BF, ML, NE, GW, TG).

**Q: Puis-je vérifier si un compte existe réellement ?**
A: Non. La validation mod-97 confirme seulement le format, pas l'existence.
Contactez directement votre banque pour vérifier l'existence d'un compte.

**Q: Comment obtenir le logo de la banque ?**
A: Utilisez `getLogoUrl(bank)` pour récupérer le favicon via Google.

**Q: Quels pays sont supportés ?**
A: Les 8 pays de l'UEMOA : Côte d'Ivoire, Sénégal, Bénin, Burkina Faso, Mali, Niger, Guinée-Bissau, Togo.

**Q: Comment contribuer ?**
A: Issues et PRs bienvenues sur [GitHub](https://github.com/kouameYao/uemoa-bank-resolver).

## License

[MIT](./LICENSE) © [kouameYao](https://github.com/kouameYao/)

## Changelog

Voir les [releases](https://github.com/kouameYao/uemoa-bank-resolver/releases).
