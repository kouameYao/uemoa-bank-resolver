# Exemples d'intégration

`uemoa-bank-resolver` est une **librairie TypeScript pure, sans dépendance à un framework**.
Le même appel — `identifyBank(iban)` — fonctionne à l'identique partout. Seule la
façon de gérer l'état et les événements change selon le framework.

| Fichier | Framework |
|---|---|
| [`react/IbanChecker.tsx`](react/IbanChecker.tsx) | React (hooks) |
| [`vue/IbanChecker.vue`](vue/IbanChecker.vue) | Vue 3 (`<script setup>`) |
| [`angular/iban-checker.component.ts`](angular/iban-checker.component.ts) | Angular (standalone + signals) |
| [`../examples/demo.mjs`](demo.mjs) | Node pur (sans UI) |

## Le cœur, commun aux trois

```ts
import { identifyBank } from "uemoa-bank-resolver";

const r = identifyBank("CI93 CI034 01049 142643500018 09");
r.valid;          // true
r.bank?.name;     // "Banque Atlantique Côte d'Ivoire"
r.parts?.bankCode;// "CI034"
```

## Installation dans ton app

Une fois le package publié sur npm :

```bash
npm install uemoa-bank-resolver
```

En attendant (test local), depuis le dossier du package :

```bash
npm run build && npm link          # dans uemoa-bank-resolver/
cd ../mon-app && npm link uemoa-bank-resolver
```

Tous les bundlers modernes (Vite, webpack, Rollup, esbuild, Angular CLI)
consomment directement les exports ESM/CJS + types fournis. Aucune config
particulière requise.

## Côté client vs côté serveur

La librairie est isomorphe : elle marche dans le navigateur (≈ 34 Ko, tree-shakable)
comme côté serveur (Node). Pour ne pas exposer toute la base au client, tu peux
aussi l'appeler depuis une API/endpoint de ton choix et ne renvoyer que le résultat.
