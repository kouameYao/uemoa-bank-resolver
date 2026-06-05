# uemoa-bank-resolver

[![npm version](https://img.shields.io/npm/v/uemoa-bank-resolver.svg)](https://www.npmjs.com/package/uemoa-bank-resolver)
[![CI](https://github.com/your-org/uemoa-bank-resolver/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/uemoa-bank-resolver/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/uemoa-bank-resolver.svg)](https://www.npmjs.com/package/uemoa-bank-resolver)
[![bundle size](https://img.shields.io/bundlephobia/minzip/uemoa-bank-resolver)](https://bundlephobia.com/package/uemoa-bank-resolver)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Identify the bank behind any **UEMOA / BCEAO** IBAN or RIB — validate, decompose, and look up the institution offline. **Zero runtime dependencies.**

Couvre les 8 pays de la zone UEMOA (BCEAO) : 🇧🇯 Bénin · 🇧🇫 Burkina Faso · 🇨🇮 Côte d'Ivoire · 🇬🇼 Guinée-Bissau · 🇲🇱 Mali · 🇳🇪 Niger · 🇸🇳 Sénégal · 🇹🇬 Togo.

Données : **161 établissements de crédit** (136 banques + 25 établissements financiers) issus de la liste officielle de la **BCEAO / Commission Bancaire de l'UMOA au 31 décembre 2025**.

---

## Installation

```bash
npm install uemoa-bank-resolver
```

ESM et CommonJS, types TypeScript inclus. Node ≥ 18.

## Démarrage rapide

```ts
import { identifyBank } from "uemoa-bank-resolver";

const result = identifyBank("CI93 CI034 01049 142643500018 09");

result.valid;            // true
result.country;          // "CI"
result.bank?.name;       // "Banque Atlantique Côte d'Ivoire"
result.bank?.shortName;  // "BACI"
result.parts?.bankCode;  // "CI034"
result.parts?.branchCode;// "01049"
```

Accepte aussi bien un **IBAN** (28 caractères) qu'un **RIB brut** (24 caractères), avec ou sans espaces/tirets.

## Structure d'un IBAN UEMOA

```
CI93  CI034   01049   142643500018   09
└┬─┘  └─┬─┘   └─┬─┘   └────┬─────┘   └┬┘
pays  code     code      numéro     clé
+clé  banque   guichet   de compte  RIB
IBAN  (5)      (5)       (12)       (2)
```

IBAN = **code pays (2) + clé IBAN (2) + BBAN (24)** = **28 caractères**.
Le **code banque** vaut `ISO pays + 3 chiffres` (ex. `CI034`) et provient du numéro d'inscription BCEAO (`A 0034 G` → `CI034`).

## API

### `identifyBank(input: string): ResolveResult`

Point d'entrée principal. Ne lève jamais d'exception : les erreurs sont remontées via `valid` / `errors`.

```ts
interface ResolveResult {
  input: string;
  normalized: string;
  isIban: boolean;
  valid: boolean;              // structure OK + (pour un IBAN) mod-97 OK
  errors: string[];
  warnings: string[];          // ex. code banque inconnu
  country: CountryCode | null;
  parts: IbanParts | null;
  ibanValid: boolean | null;   // mod-97 ; null pour un RIB brut
  ribKeyValid: boolean | null; // toujours null — voir « Clé RIB » plus bas
  bank: Bank | null;
}
```

### Autres fonctions exportées

| Fonction | Description |
|---|---|
| `isValidIban(input)` | Valide longueur, pays et checksum **mod-97** (ISO 13616). |
| `decompose(input)` | Découpe en parties nommées. Lève `InvalidFormatError` si la forme est invalide. |
| `formatParts(input, sep?)` | `"CI93 CI034 01049 142643500018 09"` (groupes sémantiques). |
| `formatIban(input, sep?)` | `"CI93 CI03 4010 4914 2643 5000 1809"` (blocs de 4). |
| `lookupBank(country, bankCode)` | Banque par pays + code banque, ou `null`. |
| `getBanksByCountry(country)` | Toutes les institutions d'un pays. |
| `listBanks()` | Les 161 institutions. |
| `toIban(country, bban)` | Construit un IBAN valide à partir d'un RIB (calcule la clé IBAN). |
| `generateIban(options)` | Génère un IBAN au checksum valide (tests/fixtures). |
| `deriveBankCode(country, registration)` | `("CI", "A 0008 D") → "CI008"`. |

```ts
import { lookupBank, isValidIban, decompose } from "uemoa-bank-resolver";

isValidIban("CI93CI0340104914264350001809");         // true
lookupBank("SN", "SN011")?.name;                       // "Société Générale Sénégal"
decompose("CI0340104914264350001809").accountNumber;   // "142643500018"
```

## Données : BIC, logo et mises à jour

Chaque banque expose ces champs :

```ts
interface Bank {
  country: CountryCode;   // "CI"
  bankCode: string;       // "CI034"
  registration: string;   // "A 0034 G"  (numéro d'inscription BCEAO)
  name: string;
  shortName?: string;
  type: "bank" | "financial";
  presence?: "filiale" | "succursale";
  bic?: string | null;    // à enrichir (non publié par la BCEAO)
  logo?: string | null;   // à enrichir (URL ou chemin)
}
```

Le champ **`bic`** est renseigné pour ~90 établissements (toutes les grandes banques actives), **rapproché par nom depuis des annuaires SWIFT publics** — ⚠️ communautaire, **à vérifier** avant tout virement (peut être obsolète, ou refléter l'ancien nom d'une banque renommée). Le champ **`logo`** est vide (la BCEAO ne le publie pas ; attention aux marques déposées). Pour compléter/corriger, éditez [`src/data/registry.ts`](src/data/registry.ts) (chaque ligne accepte `bic` et `logo`), puis `npm run build`.

Pour mettre à jour la liste des banques, modifiez ce même fichier à partir de la
[liste officielle BCEAO des établissements de crédit agréés](https://www.bceao.int/fr/content/etablissements-de-credit-et-compagnies-financieres-de-lumoa).
Le `bankCode` est dérivé automatiquement du `registration`.

## ⚠️ Clé RIB (clé de contrôle)

La validation d'intégrité fiable d'un **IBAN** est le **checksum mod-97** (`isValidIban`), vérifié sur des IBAN réels.

La **clé RIB** à 2 chiffres (dernier bloc) n'est **pas** vérifiée automatiquement : l'algorithme exact employé par la BCEAO pour les codes banque modernes (préfixés ISO) n'est pas confirmé, et la formule française classique ne correspond pas aux clés observées. Les fonctions `computeRibKey` / `isValidRibKey` restent exportées à titre **expérimental** — toute contribution établissant l'algorithme correct est bienvenue.

## Limites & honnêteté

- **BIC : ~90/161 renseignés** (annuaires SWIFT publics, rapprochés par nom) → **communautaire, à vérifier**. **Logos non livrés** (et ⚠️ **marques déposées** — vérifiez le droit de distribution).
- **RIB brut sans IBAN** : aucune somme de contrôle disponible (clé RIB non vérifiée) → seule la **structure** est validée. Un RIB mal saisi peut donc passer `valid: true`. Fournissez l'IBAN complet pour une vraie vérification d'intégrité (mod-97).
- **Dérivation du code banque** : la règle `inscription → code banque` est vérifiée sur des IBAN réels (CI, SN) mais reste une **convention** ; validez-la sur vos propres comptes si l'exactitude est critique.
- **Données datées** (31/12/2025) : fusions, agréments et radiations évoluent — pensez à mettre à jour `registry.ts`.
- Les **établissements financiers** (non bancaires) sont inclus (`type: "financial"`) ; certains n'émettent pas de comptes IBAN.
- Les **succursales** d'un groupe régional ont leur propre code banque dans le pays d'accueil ; elles sont incluses avec `presence: "succursale"`.

## Développement

```bash
npm install
npm test              # vitest
npm run test:coverage # + couverture (seuils dans vitest.config.ts)
npm run typecheck     # tsc --noEmit
npm run lint          # Biome (lint + format) ; lint:fix pour corriger
npm run build         # tsup → dist (ESM + CJS + d.ts)
npm run check:exports # publint + are-the-types-wrong
```

Qualité : zéro dépendance runtime · build dual **ESM + CJS** + types · couverture
≈ 98 % · empaquetage vérifié (`node10`, CJS, ESM, bundler tous ✅) · CI multi-Node
(18/20/22) · publication npm **avec provenance** via tag `v*`.

## Publier sur npm

```bash
# 1. remplace `your-org` dans package.json (repository, bugs, homepage)
# 2. localement :
npm publish            # prepublishOnly enchaîne lint + types + tests + build + exports
# 3. ou en CI : pousse un tag v0.1.0 → le workflow Release publie avec provenance
git tag v0.1.0 && git push --tags
```

## Sources

- BCEAO — *Liste des établissements de crédit agréés dans l'UMOA au 31 décembre 2025*.
- Commission Bancaire de l'UMOA — listes par pays.
- ISO 13616 (structure IBAN) & ISO 7064 (mod-97).

## Licence

MIT
