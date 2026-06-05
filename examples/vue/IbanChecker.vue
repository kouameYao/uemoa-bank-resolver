<!-- Vue 3 (<script setup>) — vérificateur d'IBAN / RIB UEMOA -->
<script setup lang="ts">
import { ref } from "vue";
import { identifyBank, type ResolveResult } from "uemoa-bank-resolver";

const iban = ref("");
const result = ref<ResolveResult | null>(null);

function check() {
  result.value = identifyBank(iban.value);
}
</script>

<template>
  <form aria-label="Vérification d'IBAN UEMOA" @submit.prevent="check">
    <label for="iban">IBAN ou RIB</label>
    <input
      id="iban"
      v-model="iban"
      placeholder="CI93 CI034 01049 142643500018 09"
      autocomplete="off"
      spellcheck="false"
    />
    <button type="submit">Identifier la banque</button>

    <output v-if="result && result.valid">
      <strong>{{ result.bank?.name ?? "Banque inconnue" }}</strong>
      <p>
        {{ result.country }} · code banque {{ result.parts?.bankCode }} ·
        guichet {{ result.parts?.branchCode }}
      </p>
    </output>

    <p v-else-if="result" role="alert">
      {{ result.errors[0] ?? "IBAN invalide" }}
    </p>
  </form>
</template>
