// Démo locale : node examples/demo.mjs
// (lance `npm run build` au préalable pour générer dist/)
import {
  identifyBank,
  isValidIban,
  decompose,
  formatParts,
  lookupBank,
  getBanksByCountry,
  toIban,
} from "../dist/index.js";

const line = (t) => console.log("\n" + "─".repeat(60) + "\n" + t);

line("1) identifyBank — IBAN réel Côte d'Ivoire");
console.log(identifyBank("CI93 CI034 01049 142643500018 09"));

line("2) isValidIban");
console.log("CI93CI0340104914264350001809 :", isValidIban("CI93CI0340104914264350001809"));
console.log("checksum cassé (CI00...)      :", isValidIban("CI00CI0340104914264350001809"));

line("3) decompose — RIB brut (sans préfixe IBAN)");
console.log(decompose("CI0340104914264350001809"));

line("4) formatParts");
console.log(formatParts("CI93CI0340104914264350001809"));

line("5) lookupBank");
console.log("CI008 :", lookupBank("CI", "CI008")?.name);
console.log("SN011 :", lookupBank("SN", "SN011")?.name);

line("6) toIban — construire un IBAN depuis un RIB");
console.log(toIban("CI", "CI0340104914264350001809"));

line("7) getBanksByCountry('SN') — 5 premières");
console.table(
  getBanksByCountry("SN")
    .slice(0, 5)
    .map(({ bankCode, shortName, name }) => ({ bankCode, shortName, name })),
);
