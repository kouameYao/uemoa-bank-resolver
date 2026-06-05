// React — vérificateur d'IBAN / RIB UEMOA
// Le package est du JS pur : il s'exécute aussi bien côté client que serveur.
import { useState } from "react";
import { identifyBank, type ResolveResult } from "uemoa-bank-resolver";

export function IbanChecker() {
  const [iban, setIban] = useState("");
  const [result, setResult] = useState<ResolveResult | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setResult(identifyBank(iban));
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Vérification d'IBAN UEMOA">
      <label htmlFor="iban">IBAN ou RIB</label>
      <input
        id="iban"
        value={iban}
        onChange={(e) => setIban(e.target.value)}
        placeholder="CI93 CI034 01049 142643500018 09"
        autoComplete="off"
        spellCheck={false}
      />
      <button type="submit">Identifier la banque</button>

      {result && result.valid && (
        <output>
          <strong>{result.bank?.name ?? "Banque inconnue"}</strong>
          <p>
            {result.country} · code banque {result.parts?.bankCode} · guichet{" "}
            {result.parts?.branchCode}
          </p>
        </output>
      )}

      {result && !result.valid && (
        <p role="alert">{result.errors[0] ?? "IBAN invalide"}</p>
      )}
    </form>
  );
}
