// Testeur rapide : node examples/test-rib.mjs "<IBAN ou RIB>"
// (lance `npm run build` au préalable)
import { identifyBank } from "../dist/index.js";

const input = process.argv.slice(2).join(" ").trim();
if (!input) {
  console.error('Usage : node examples/test-rib.mjs "CI93 CI034 01049 142643500018 09"');
  process.exit(1);
}

const r = identifyBank(input);
const ok = (b) => (b === true ? "✅" : b === false ? "❌" : "—");

console.log(`\nEntrée        : ${r.input}`);
console.log(`Normalisé     : ${r.normalized}`);
console.log(`Type          : ${r.isIban ? "IBAN (28)" : "RIB brut (24)"}`);
console.log(`Valide        : ${ok(r.valid)}`);
console.log(`Checksum IBAN : ${ok(r.ibanValid)}`);

if (r.parts) {
  console.log("\nDécomposition :");
  console.log(`  Pays        : ${r.parts.countryCode}${r.parts.checkDigits ? ` (clé IBAN ${r.parts.checkDigits})` : ""}`);
  console.log(`  Code banque : ${r.parts.bankCode}`);
  console.log(`  Guichet     : ${r.parts.branchCode}`);
  console.log(`  Compte      : ${r.parts.accountNumber}`);
  console.log(`  Clé RIB     : ${r.parts.ribKey}`);
}

console.log("\nBanque identifiée :");
if (r.bank) {
  console.log(`  ${r.bank.name}${r.bank.shortName ? ` (${r.bank.shortName})` : ""}`);
  console.log(`  type=${r.bank.type} · inscription=${r.bank.registration} · BIC=${r.bank.bic ?? "—"}`);
} else {
  console.log("  (code banque non répertorié)");
}

if (r.errors.length) console.log(`\n❌ Erreurs   : ${r.errors.join(" | ")}`);
if (r.warnings.length) console.log(`⚠️  Avertissements : ${r.warnings.join(" | ")}`);
console.log();
