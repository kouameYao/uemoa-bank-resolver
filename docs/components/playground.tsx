"use client";

import { useMemo, useState } from "react";
import {
  type CountryCode,
  identifyBank,
  isValidIban,
  lookupBank,
  UEMOA_COUNTRIES,
} from "uemoa-bank-resolver";
import styles from "./playground.module.css";

type Tab = "resolve" | "parse" | "validate";

const TABS: { id: Tab; label: string }[] = [
  { id: "resolve", label: "Resolve Bank" },
  { id: "parse", label: "Parse RIB" },
  { id: "validate", label: "Validate" },
];

const COUNTRIES = Object.entries(UEMOA_COUNTRIES) as [CountryCode, string][];

function Json({ value }: { value: unknown }) {
  return <pre className={styles.output}>{JSON.stringify(value, null, 2)}</pre>;
}

export function Playground() {
  const [tab, setTab] = useState<Tab>("parse");

  // Resolve Bank
  const [country, setCountry] = useState<CountryCode>("CI");
  const [bankCode, setBankCode] = useState("CI008");
  const bank = useMemo(() => lookupBank(country, bankCode), [country, bankCode]);

  // Parse / Validate
  const [rib, setRib] = useState("CI93 CI034 01049 142643500018 09");
  const parsed = useMemo(() => identifyBank(rib), [rib]);
  const valid = useMemo(() => isValidIban(rib), [rib]);

  return (
    <div className={styles.root}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "resolve" && (
        <div className={styles.body}>
          <div className={styles.controls}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pg-country">
                Country
              </label>
              <select
                id="pg-country"
                className={styles.select}
                value={country}
                onChange={(e) => setCountry(e.target.value as CountryCode)}
              >
                {COUNTRIES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {code} — {name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pg-code">
                Bank code
              </label>
              <input
                id="pg-code"
                className={styles.input}
                value={bankCode}
                spellCheck={false}
                onChange={(e) => setBankCode(e.target.value.toUpperCase())}
                placeholder="CI008"
              />
              <span className={styles.hint}>Try CI008, SN012, BF148, TG009…</span>
            </div>
          </div>
          <div>
            {bank ? (
              <div className={styles.bankCard}>
                <span className={styles.bankName}>{bank.name}</span>
                <span className={styles.bankMeta}>
                  {bank.shortName ? `${bank.shortName} · ` : ""}
                  {bank.bankCode} · {bank.type}
                  {bank.bic ? ` · BIC ${bank.bic}` : ""}
                </span>
              </div>
            ) : (
              <div className={`${styles.badge} ${styles.ko}`}>Unknown bank code</div>
            )}
            <Json value={bank ?? { result: null }} />
          </div>
        </div>
      )}

      {tab === "parse" && (
        <div className={styles.body}>
          <div className={styles.controls}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pg-rib">
                IBAN or RIB
              </label>
              <input
                id="pg-rib"
                className={styles.input}
                value={rib}
                spellCheck={false}
                onChange={(e) => setRib(e.target.value)}
                placeholder="CI93 CI034 01049 142643500018 09"
              />
              <span className={styles.hint}>
                {parsed.bank ? `🏦 ${parsed.bank.name}` : "Enter a UEMOA IBAN or 24-char RIB"}
              </span>
            </div>
          </div>
          <Json value={parsed} />
        </div>
      )}

      {tab === "validate" && (
        <div className={styles.body}>
          <div className={styles.controls}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pg-validate">
                IBAN or RIB
              </label>
              <input
                id="pg-validate"
                className={styles.input}
                value={rib}
                spellCheck={false}
                onChange={(e) => setRib(e.target.value)}
                placeholder="CI93 CI034 01049 142643500018 09"
              />
            </div>
            <div className={`${styles.badge} ${parsed.valid ? styles.ok : styles.ko}`}>
              {parsed.valid ? "✓ Valid" : "✗ Invalid"}
            </div>
            <span className={styles.hint}>
              {parsed.isIban
                ? `IBAN checksum (mod-97): ${valid ? "OK" : "failed"}`
                : "Raw RIB — structure checked only (no checksum)"}
            </span>
          </div>
          <Json
            value={{
              valid: parsed.valid,
              isIban: parsed.isIban,
              ibanValid: parsed.ibanValid,
              errors: parsed.errors,
              warnings: parsed.warnings,
            }}
          />
        </div>
      )}
    </div>
  );
}
