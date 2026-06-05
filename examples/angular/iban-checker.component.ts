// Angular (standalone, signals) — vérificateur d'IBAN / RIB UEMOA
import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { identifyBank, type ResolveResult } from "uemoa-bank-resolver";

@Component({
  selector: "app-iban-checker",
  standalone: true,
  imports: [FormsModule],
  template: `
    <form aria-label="Vérification d'IBAN UEMOA" (ngSubmit)="check()">
      <label for="iban">IBAN ou RIB</label>
      <input
        id="iban"
        name="iban"
        [(ngModel)]="iban"
        placeholder="CI93 CI034 01049 142643500018 09"
        autocomplete="off"
        spellcheck="false"
      />
      <button type="submit">Identifier la banque</button>

      @if (result(); as r) {
        @if (r.valid) {
          <output>
            <strong>{{ r.bank?.name ?? "Banque inconnue" }}</strong>
            <p>
              {{ r.country }} · code banque {{ r.parts?.bankCode }} · guichet
              {{ r.parts?.branchCode }}
            </p>
          </output>
        } @else {
          <p role="alert">{{ r.errors[0] ?? "IBAN invalide" }}</p>
        }
      }
    </form>
  `,
})
export class IbanCheckerComponent {
  iban = "";
  readonly result = signal<ResolveResult | null>(null);

  check(): void {
    this.result.set(identifyBank(this.iban));
  }
}
