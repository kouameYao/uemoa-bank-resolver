/**
 * Official website domains, keyed by `${country}:${bankCode}`.
 *
 * ⚠️ Curated, partial and **to verify** — covers the major banking groups whose
 * domains are well known. Logos are NOT bundled (trademarks): these domains feed
 * {@link getLogoUrl}, which builds a logo URL via a third-party service.
 * Add or correct entries here; group brands typically share one domain.
 */
export const WEBSITES: Record<string, string> = {
  // Ecobank (group)
  "CI:CI059": "ecobank.com",
  "SN:SN094": "ecobank.com",
  "BJ:BJ062": "ecobank.com",
  "BF:BF083": "ecobank.com",
  "ML:ML090": "ecobank.com",
  "NE:NE095": "ecobank.com",
  "TG:TG055": "ecobank.com",
  "GW:GW143": "ecobank.com",

  // UBA (group)
  "CI:CI150": "ubagroup.com",
  "BJ:BJ067": "ubagroup.com",
  "BF:BF022": "ubagroup.com",
  "ML:ML206": "ubagroup.com",
  "SN:SN153": "ubagroup.com",

  // Coris Bank International (group)
  "BF:BF148": "corisbank.com",
  "CI:CI166": "corisbank.com",
  "ML:ML181": "corisbank.com",
  "SN:SN213": "corisbank.com",
  "TG:TG182": "corisbank.com",
  "BJ:BJ212": "corisbank.com",
  "NE:NE210": "corisbank.com",
  "GW:GW243": "corisbank.com",

  // Orabank (Oragroup)
  "CI:CI121": "orabank.net",
  "BJ:BJ058": "orabank.net",
  "TG:TG116": "orabank.net",
  "BF:BF171": "orabank.net",
  "GW:GW172": "orabank.net",
  "ML:ML173": "orabank.net",
  "NE:NE174": "orabank.net",
  "SN:SN175": "orabank.net",

  // Banque Atlantique (group)
  "CI:CI034": "banqueatlantique.net",
  "BJ:BJ115": "banqueatlantique.net",
  "BF:BF134": "banqueatlantique.net",
  "ML:ML135": "banqueatlantique.net",
  "NE:NE136": "banqueatlantique.net",
  "SN:SN137": "banqueatlantique.net",
  "TG:TG138": "banqueatlantique.net",
  "GW:GW195": "banqueatlantique.net",

  // CBAO, Groupe Attijariwafa Bank
  "SN:SN012": "cbao.sn",
  "BJ:BJ177": "cbao.sn",
  "BF:BF161": "cbao.sn",
  "NE:NE168": "cbao.sn",

  // BGFIBank (group)
  "CI:CI162": "bgfi.com",
  "BJ:BJ157": "bgfi.com",
  "SN:SN189": "bgfi.com",

  // Société Générale
  "CI:CI008": "societegenerale.ci",
  "SN:SN011": "societegenerale.sn",

  // Single-country / confirmed
  "CI:CI042": "nsiabanque.ci", // NSIA Banque CI
  "CI:CI006": "bicici.com", // BICICI
};
