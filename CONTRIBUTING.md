# Contributing

Merci de contribuer à `uemoa-bank-resolver` ! 🙏

## Mise en route

```bash
git clone https://github.com/your-org/uemoa-bank-resolver.git
cd uemoa-bank-resolver
npm install
npm test
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm test` | Tests (Vitest) |
| `npm run test:coverage` | Tests + couverture (seuils dans `vitest.config.ts`) |
| `npm run typecheck` | Vérification de types |
| `npm run lint` / `lint:fix` | Lint + format (Biome) |
| `npm run build` | Build ESM + CJS + types |
| `npm run check:exports` | Vérifie l'empaquetage (`publint` + `are-the-types-wrong`) |

Avant d'ouvrir une PR : `npm run lint && npm run typecheck && npm run test:coverage && npm run build`.

## Mettre à jour la liste des banques

La source unique est [`src/data/registry.ts`](src/data/registry.ts).
Ajoute / modifie une ligne à partir de la
[liste officielle BCEAO des établissements de crédit agréés](https://www.bceao.int/fr/content/etablissements-de-credit-et-compagnies-financieres-de-lumoa).

- `registration` doit être le **numéro d'inscription officiel** (ex. `A 0008 D`).
- `bankCode` est **dérivé automatiquement** — ne le renseigne pas.
- `bic` et `logo` sont optionnels ; renseigne-les si tu disposes d'une source fiable.

Ajoute un test si tu corriges un code ou ajoutes une banque importante, et mets
à jour le total dans `test/data.test.ts` si le nombre d'institutions change.

## Clé RIB

L'algorithme exact de la clé RIB BCEAO (codes banque préfixés ISO) n'est pas
confirmé. Si tu peux l'établir avec des références/exemples réels, c'est une
contribution très bienvenue (voir `src/ribKey.ts`).

## Commits

Format [Conventional Commits](https://www.conventionalcommits.org/) :
`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`…

## Licence

En contribuant, tu acceptes que ton code soit publié sous licence MIT.
