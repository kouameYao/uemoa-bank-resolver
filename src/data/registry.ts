import type { CountryCode, InstitutionType, Presence } from "../types";

/**
 * A raw registry row, as published by the BCEAO / Commission Bancaire de l'UMOA.
 * The 5-character `bankCode` (e.g. "CI008") is derived from `registration`
 * at load time — see `deriveBankCode` in `data/index.ts`.
 *
 * `bic`: sourced from public SWIFT/BIC directories (juristique.org) and matched
 * by bank name. ⚠️ Community-sourced — VERIFY before relying on it for transfers.
 * It may be missing, outdated, or — for renamed banks — refer to the former name.
 * `logo` is intentionally left empty: fill it from your own source (mind trademarks).
 */
export interface RegistryRow {
  country: CountryCode;
  /** Official "numéro d'inscription", e.g. "A 0008 D". */
  registration: string;
  name: string;
  shortName?: string;
  type: InstitutionType;
  presence?: Presence;
  bic?: string | null;
  logo?: string | null;
  website?: string | null;
}

/**
 * Établissements de crédit agréés dans l'UMOA.
 * Source (banks/registration): BCEAO — « Liste des établissements de crédit agréés
 * dans l'UMOA au 31 décembre 2025 » and the per-country lists of the Commission
 * Bancaire de l'UMOA. Source (BIC): public SWIFT directories, name-matched.
 *
 * 136 banks + 25 financial institutions = 161 entries.
 */
export const REGISTRY: RegistryRow[] = [
  // ───────────────────────────── BÉNIN (B → BJ) ─────────────────────────────
  { country: "BJ", registration: "B 0061 F", name: "Bank of Africa - Bénin", shortName: "BOA-BÉNIN", type: "bank", presence: "filiale", bic: "AFRIBJBJ" },
  { country: "BJ", registration: "B 0115 P", name: "Banque Atlantique Bénin", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATBJBJBJ" },
  { country: "BJ", registration: "B 0107 F", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Bénin", shortName: "BSIC-BÉNIN", type: "bank", presence: "filiale", bic: "BSAHBJBJ" },
  { country: "BJ", registration: "B 0157 K", name: "BGFIBank Bénin", shortName: "BGFIBANK", type: "bank", presence: "filiale", bic: "BGFIBJBJ" },
  { country: "BJ", registration: "B 0099 X", name: "NSIA Banque Bénin", shortName: "NSIA BANQUE", type: "bank", presence: "filiale" },
  { country: "BJ", registration: "B 0062 G", name: "Ecobank - Bénin", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCBJBJ" },
  { country: "BJ", registration: "B 0058 C", name: "Orabank - Bénin", shortName: "ORABANK", type: "bank", presence: "filiale", bic: "ORBKBJBJ" },
  { country: "BJ", registration: "B 0104 C", name: "Société Générale - Bénin", shortName: "SG BÉNIN", type: "bank", presence: "filiale", bic: "SOGEBJBJ" },
  { country: "BJ", registration: "B 0067 M", name: "United Bank for Africa Bénin", shortName: "UBA-BÉNIN", type: "bank", presence: "filiale" },
  { country: "BJ", registration: "B 0184 P", name: "Bange Bank Bénin (ex CCEI Bank Bénin)", shortName: "BANGE BANK", type: "bank", presence: "filiale", bic: "CCEIBJBJ" },
  { country: "BJ", registration: "B 0185 Q", name: "Banque Internationale pour l'Industrie et le Commerce", shortName: "BIIC", type: "bank", presence: "filiale" },
  { country: "BJ", registration: "B 0212 V", name: "Coris Bank International - Bénin", shortName: "CBI-BÉNIN", type: "bank", presence: "filiale" },
  { country: "BJ", registration: "B 0177 G", name: "CBAO, Groupe Attijariwafa Bank, Succursale du Bénin", shortName: "CBAO", type: "bank", presence: "succursale", bic: "CBAOBJBJ" },
  { country: "BJ", registration: "B 0199 F", name: "Société Nigérienne de Banque (SONIBANK), Succursale du Bénin", shortName: "SONIBANK", type: "bank", presence: "succursale" },
  { country: "BJ", registration: "B 0216 Z", name: "L'Africaine des Garanties et de Cautionnement", shortName: "AFGC", type: "financial" },

  // ──────────────────────────── BURKINA (C → BF) ────────────────────────────
  { country: "BF", registration: "C 0084 A", name: "Bank of Africa - Burkina Faso", shortName: "BOA-BURKINA", type: "bank", presence: "filiale", bic: "AFRIBFBF" },
  { country: "BF", registration: "C 0134 E", name: "Banque Atlantique Burkina Faso", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATBFBFBF" },
  { country: "BF", registration: "C 0207 J", name: "Banque Agricole du Faso", shortName: "BADF", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0056 V", name: "Banque Commerciale du Burkina", shortName: "BCB", type: "bank", presence: "filiale", bic: "BNCFBFBF" },
  { country: "BF", registration: "C 0253 J", name: "Banque Postale du Burkina Faso", shortName: "BPBF", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0139 K", name: "International Business Bank Burkina", shortName: "IB BANK BURKINA", type: "bank", presence: "filiale", bic: "BIBUBFBF" },
  { country: "BF", registration: "C 0023 J", name: "Vista Bank Burkina", shortName: "VISTA BANK", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0108 B", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Burkina Faso", shortName: "BSIC-BURKINA", type: "bank", presence: "filiale", bic: "BSAHBFBF" },
  { country: "BF", registration: "C 0148 V", name: "Coris Bank International", shortName: "CBI", type: "bank", presence: "filiale", bic: "CORIBFBF" },
  { country: "BF", registration: "C 0083 Z", name: "Ecobank - Burkina", shortName: "ECOBANK", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0179 D", name: "Banque de l'Union - Burkina Faso", shortName: "BDU-BF", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0074 P", name: "Société Générale - Burkina Faso", shortName: "SG BURKINA", type: "bank", presence: "filiale", bic: "SGBBBFBF" },
  { country: "BF", registration: "C 0022 H", name: "United Bank for Africa Burkina", shortName: "UBA BURKINA", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0202 D", name: "Wendkuni Bank International", shortName: "WBI", type: "bank", presence: "filiale" },
  { country: "BF", registration: "C 0171 V", name: "Orabank Côte d'Ivoire, Succursale du Burkina", shortName: "ORABANK", type: "bank", presence: "succursale", bic: "ORBKBFBF" },
  { country: "BF", registration: "C 0161 J", name: "CBAO Groupe Attijariwafa Bank, Succursale du Burkina", shortName: "CBAO", type: "bank", presence: "succursale", bic: "CBAOBFBG" },
  { country: "BF", registration: "C 0085 B", name: "Fidelis Finance - Burkina Faso", shortName: "FIDELIS FINANCE", type: "financial", presence: "filiale" },
  { country: "BF", registration: "C 0021 G", name: "Société Burkinabè de Crédit Automobile", shortName: "SOBCA", type: "financial", presence: "filiale" },
  { country: "BF", registration: "C 0146 S", name: "Société Financière de Garantie Interbancaire du Burkina", shortName: "SOFIGIB", type: "financial", presence: "filiale" },
  { country: "BF", registration: "C 0149 W", name: "Société Africaine de Crédit Automobile (SAFCA - Alios Finance), Succursale du Burkina", shortName: "SAFCA", type: "financial", presence: "succursale" },

  // ────────────────────────── CÔTE D'IVOIRE (A → CI) ─────────────────────────
  { country: "CI", registration: "A 0006 B", name: "Banque Internationale pour le Commerce et l'Industrie de la Côte d'Ivoire", shortName: "BICICI", type: "bank", presence: "filiale", bic: "BICICIAB" },
  { country: "CI", registration: "A 0042 Q", name: "NSIA Banque Côte d'Ivoire", shortName: "NSIA BANQUE CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0007 C", name: "Société Ivoirienne de Banque", shortName: "SIB", type: "bank", presence: "filiale", bic: "SIVBCIAB" },
  { country: "CI", registration: "A 0008 D", name: "Société Générale Côte d'Ivoire", shortName: "SGCI", type: "bank", presence: "filiale", bic: "SGCICIAB" },
  { country: "CI", registration: "A 0118 Y", name: "Citibank Côte d'Ivoire", shortName: "CITIBANK CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0032 E", name: "Bank of Africa - Côte d'Ivoire", shortName: "BOA-CI", type: "bank", presence: "filiale", bic: "AFRICIAB" },
  { country: "CI", registration: "A 0034 G", name: "Banque Atlantique Côte d'Ivoire", shortName: "BACI", type: "bank", presence: "filiale", bic: "ATCICIAB" },
  { country: "CI", registration: "A 0059 J", name: "Ecobank - Côte d'Ivoire", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCCIAB" },
  { country: "CI", registration: "A 0068 T", name: "Banque de l'Habitat de Côte d'Ivoire", shortName: "BHCI", type: "bank", presence: "filiale", bic: "BHCICIAB" },
  { country: "CI", registration: "A 0092 V", name: "Banque Nationale d'Investissement", shortName: "BNI", type: "bank", presence: "filiale", bic: "CSSSCIAB" },
  { country: "CI", registration: "A 0097 A", name: "Standard Chartered Bank Côte d'Ivoire", shortName: "SCB CI", type: "bank", presence: "filiale", bic: "SCBLCIAB" },
  { country: "CI", registration: "A 0106 K", name: "Afriland First Bank Côte d'Ivoire", shortName: "FIRST BANK CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0112 R", name: "Versus Bank", shortName: "VERSUS BANK", type: "bank", presence: "filiale", bic: "VSBKCIAB" },
  { country: "CI", registration: "A 0121 B", name: "Orabank - Côte d'Ivoire", shortName: "ORABANK", type: "bank", presence: "filiale", bic: "ORBKCIAB" },
  { country: "CI", registration: "A 0131 M", name: "Bridge Bank Group Côte d'Ivoire", shortName: "BBG-CI", type: "bank", presence: "filiale", bic: "BGCDCIAB" },
  { country: "CI", registration: "A 0150 H", name: "United Bank for Africa", shortName: "UBA", type: "bank", presence: "filiale", bic: "UNAFCIAB" },
  { country: "CI", registration: "A 0154 M", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Côte d'Ivoire", shortName: "BSIC-CI", type: "bank", presence: "filiale", bic: "BSAHCIAB" },
  { country: "CI", registration: "A 0162 W", name: "BGFIBank Côte d'Ivoire", shortName: "BGFIBANK-CI", type: "bank", presence: "filiale", bic: "BGFICIAB" },
  { country: "CI", registration: "A 0163 X", name: "Guaranty Trust Bank Côte d'Ivoire", shortName: "GTBANK-CI", type: "bank", presence: "filiale", bic: "GTBICIAB" },
  { country: "CI", registration: "A 0166 A", name: "Coris Bank International Côte d'Ivoire", shortName: "CBI-CI", type: "bank", presence: "filiale", bic: "CORICIAB" },
  { country: "CI", registration: "A 0180 Q", name: "Banque de l'Union - Côte d'Ivoire", shortName: "BDU-CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0198 K", name: "Stanbic Bank", shortName: "STANBIC BANK", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0201 N", name: "Afrika Banque Côte d'Ivoire (ex Banque d'Abidjan)", shortName: "AFRIKA BANQUE CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0211 Z", name: "Mansa Bank", shortName: "MANSA BANK", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0214 C", name: "Orange Bank Africa", shortName: "ORANGE BANK", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0260 C", name: "AFG Bank Côte d'Ivoire", shortName: "AFG BANK CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0265 P", name: "Zénith Bank Côte d'Ivoire", shortName: "ZÉNITH BANK CI", type: "bank", presence: "filiale" },
  { country: "CI", registration: "A 0188 Z", name: "Banque Malienne de Solidarité, Succursale de Côte d'Ivoire", shortName: "BMS", type: "bank", presence: "succursale" },
  { country: "CI", registration: "A 0194 F", name: "Banque Régionale de Marchés, Succursale de Côte d'Ivoire", shortName: "BRM", type: "bank", presence: "succursale" },
  { country: "CI", registration: "A 0001 W", name: "Société Africaine de Crédit Automobile (SAFCA - Alios Finance)", shortName: "SAFCA", type: "financial", presence: "filiale" },
  { country: "CI", registration: "A 0264 G", name: "Société de Garantie des Crédits aux PME Ivoiriennes", shortName: "SGPME", type: "financial", presence: "filiale" },
  { country: "CI", registration: "A 0186 X", name: "Fidelis Finance Burkina Faso, Succursale de Côte d'Ivoire", shortName: "FIDELIS FINANCE", type: "financial", presence: "succursale" },
  { country: "CI", registration: "A 0261 D", name: "Niger Transfert d'Argent (NITA), Succursale de Côte d'Ivoire", shortName: "NITA", type: "financial", presence: "succursale" },

  // ─────────────────────────── GUINÉE-BISSAU (S → GW) ────────────────────────
  { country: "GW", registration: "S 0096 T", name: "Banco da África Ocidental", shortName: "BAO", type: "bank", presence: "filiale", bic: "BAOBGWGW" },
  { country: "GW", registration: "S 0128 D", name: "Banco da União", shortName: "BDU", type: "bank", presence: "filiale", bic: "BDUGGWGW" },
  { country: "GW", registration: "S 0143 V", name: "Ecobank - Guinée Bissau", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCGWGW" },
  { country: "GW", registration: "S 0172 B", name: "Orabank Côte d'Ivoire, Succursale de Guinée-Bissau", shortName: "ORABANK", type: "bank", presence: "succursale", bic: "ORBKGWGW" },
  { country: "GW", registration: "S 0195 B", name: "Banque Atlantique Côte d'Ivoire, Succursale de Guinée-Bissau", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "succursale" },
  { country: "GW", registration: "S 0243 D", name: "Coris Bank International Sénégal, Succursale de Guinée-Bissau", shortName: "CBI", type: "bank", presence: "succursale" },

  // ───────────────────────────── MALI (D → ML) ──────────────────────────────
  { country: "ML", registration: "D 0016 W", name: "Banque de Développement du Mali", shortName: "BDM", type: "bank", presence: "filiale", bic: "BDMAMLBA" },
  { country: "ML", registration: "D 0041 Y", name: "Banque Internationale pour le Mali", shortName: "BIM", type: "bank", presence: "filiale", bic: "BIPMMLBA" },
  { country: "ML", registration: "D 0043 A", name: "Banque Nationale de Développement Agricole", shortName: "BNDA", type: "bank", presence: "filiale", bic: "BNADMLBA" },
  { country: "ML", registration: "D 0044 B", name: "Banque Commerciale du Sahel", shortName: "BCS", type: "bank", presence: "filiale", bic: "ALIMMLBA" },
  { country: "ML", registration: "D 0045 C", name: "Bank of Africa - Mali", shortName: "BOA-MALI", type: "bank", presence: "filiale", bic: "AFRIMLBA" },
  { country: "ML", registration: "D 0089 A", name: "AFG Bank Mali (ex BICI-M)", shortName: "AFG ML", type: "bank", presence: "filiale", bic: "BICIMLBA" },
  { country: "ML", registration: "D 0135 A", name: "Banque Atlantique Mali", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATMLMLBA" },
  { country: "ML", registration: "D 0102 P", name: "Banque Malienne de Solidarité", shortName: "BMS", type: "bank", presence: "filiale", bic: "BMSMMLBA" },
  { country: "ML", registration: "D 0147 N", name: "Banque pour le Commerce et l'Industrie du Mali", shortName: "BCI-MALI", type: "bank", presence: "filiale", bic: "COLIMLBA" },
  { country: "ML", registration: "D 0109 X", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Mali", shortName: "BSIC-MALI", type: "bank", presence: "filiale", bic: "BSAHMLBA" },
  { country: "ML", registration: "D 0090 B", name: "Ecobank - Mali", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCMLBA" },
  { country: "ML", registration: "D 0181 A", name: "Coris Bank International - Mali", shortName: "CBI-MALI", type: "bank", presence: "filiale", bic: "CORIMLBA" },
  { country: "ML", registration: "D 0206 C", name: "United Bank for Africa - Mali", shortName: "UBA-MALI", type: "bank", presence: "filiale" },
  { country: "ML", registration: "D 0173 R", name: "Orabank Côte d'Ivoire, Succursale du Mali", shortName: "ORABANK", type: "bank", presence: "succursale", bic: "ORBKMLBA" },
  { country: "ML", registration: "D 0098 K", name: "Fonds de Garantie Hypothécaire du Mali", shortName: "FGHM", type: "financial", presence: "filiale" },
  { country: "ML", registration: "D 0183 C", name: "Fonds de Garantie pour le Secteur Privé", shortName: "FGSP", type: "financial", presence: "filiale" },
  { country: "ML", registration: "D 0152 T", name: "Société Africaine de Crédit Automobile (SAFCA - Alios Finance), Succursale du Mali", shortName: "SAFCA", type: "financial", presence: "succursale" },

  // ───────────────────────────── NIGER (H → NE) ─────────────────────────────
  { country: "NE", registration: "H 0038 Y", name: "Bank of Africa - Niger", shortName: "BOA-NIGER", type: "bank", presence: "filiale", bic: "AFRINENI" },
  { country: "NE", registration: "H 0164 K", name: "Banque Agricole du Niger", shortName: "BAGRI", type: "bank", presence: "filiale", bic: "BANENENI" },
  { country: "NE", registration: "H 0136 E", name: "Banque Atlantique Niger", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATNENENI" },
  { country: "NE", registration: "H 0057 T", name: "Banque Commerciale du Niger", shortName: "BCN", type: "bank", presence: "filiale", bic: "BCDNNENI" },
  { country: "NE", registration: "H 0040 A", name: "Banque Internationale pour l'Afrique au Niger", shortName: "BIA-NIGER", type: "bank", presence: "filiale", bic: "BIANNENI" },
  { country: "NE", registration: "H 0081 V", name: "Banque Islamique du Niger", shortName: "BIN", type: "bank", presence: "filiale", bic: "BICVNENI" },
  { country: "NE", registration: "H 0110 B", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Niger", shortName: "BSIC-NIGER", type: "bank", presence: "filiale", bic: "BSAHNENI" },
  { country: "NE", registration: "H 0095 K", name: "Ecobank - Niger", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCNENI" },
  { country: "NE", registration: "H 0064 B", name: "Société Nigérienne de Banque", shortName: "SONIBANK", type: "bank", presence: "filiale", bic: "SOCNNENI" },
  { country: "NE", registration: "H 0208 H", name: "Banque de l'Habitat du Niger", shortName: "BHN", type: "bank", presence: "filiale" },
  { country: "NE", registration: "H 0168 P", name: "CBAO, Groupe Attijariwafa Bank, Succursale du Niger", shortName: "CBAO", type: "bank", presence: "succursale", bic: "CBAONENI" },
  { country: "NE", registration: "H 0174 W", name: "Orabank Côte d'Ivoire, Succursale du Niger", shortName: "ORABANK", type: "bank", presence: "succursale", bic: "ORBKNENI" },
  { country: "NE", registration: "H 0193 R", name: "Banque Régionale de Marchés, Succursale du Niger", shortName: "BRM", type: "bank", presence: "succursale" },
  { country: "NE", registration: "H 0210 K", name: "Coris Bank International (CBI) Burkina, Succursale du Niger", shortName: "CBI", type: "bank", presence: "succursale" },
  { country: "NE", registration: "H 0129 X", name: "Société Sahélienne de Financement", shortName: "SAHFI", type: "financial", presence: "filiale" },
  { country: "NE", registration: "H 0205 E", name: "Al-Izza Transfert d'Argent International", shortName: "AL-IZZA", type: "financial", presence: "filiale" },
  { country: "NE", registration: "H 0251 K", name: "Amana Transfert d'Argent et Finance", shortName: "AMANA", type: "financial", presence: "filiale" },
  { country: "NE", registration: "H 0204 D", name: "Bureau National d'Intermédiation Financière", shortName: "BNIF-AFUWA", type: "financial", presence: "filiale" },
  { country: "NE", registration: "H 0209 J", name: "Niger Transfert d'Argent", shortName: "NITA", type: "financial", presence: "filiale" },
  { country: "NE", registration: "H 0250 D", name: "Zeyna", shortName: "ZEYNA", type: "financial", presence: "filiale" },

  // ──────────────────────────── SÉNÉGAL (K → SN) ────────────────────────────
  { country: "SN", registration: "K 0010 A", name: "Sunu Bank (ex BICIS)", shortName: "SUNU BANK", type: "bank", presence: "filiale", bic: "BICISNDX" },
  { country: "SN", registration: "K 0100 Y", name: "Bank of Africa - Sénégal", shortName: "BOA-SÉNÉGAL", type: "bank", presence: "filiale", bic: "AFRISNDA" },
  { country: "SN", registration: "K 0137 N", name: "Banque Atlantique Sénégal", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATSNSNDA" },
  { country: "SN", registration: "K 0039 G", name: "Banque de l'Habitat du Sénégal", shortName: "BHS", type: "bank", presence: "filiale", bic: "LHSESNDA" },
  { country: "SN", registration: "K 0117 R", name: "Banque des Institutions Mutualistes d'Afrique de l'Ouest", shortName: "BIMAO", type: "bank", presence: "filiale", bic: "BIMUSNDA" },
  { country: "SN", registration: "K 0079 A", name: "Banque Islamique du Sénégal", shortName: "BIS", type: "bank", presence: "filiale", bic: "ISSNSNDA" },
  { country: "SN", registration: "K 0144 W", name: "Banque Régionale de Marchés", shortName: "BRM", type: "bank", presence: "filiale", bic: "BRMXSNDA" },
  { country: "SN", registration: "K 0111 K", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Sénégal", shortName: "BSIC-SÉNÉGAL", type: "bank", presence: "filiale", bic: "BSAHSNDA" },
  { country: "SN", registration: "K 0048 R", name: "La Banque Agricole", shortName: "LBA", type: "bank", presence: "filiale", bic: "CADKSNDA" },
  { country: "SN", registration: "K 0012 C", name: "CBAO, Groupe Attijariwafa Bank", shortName: "CBAO", type: "bank", presence: "filiale", bic: "CBAOSNDA" },
  { country: "SN", registration: "K 0141 S", name: "Citibank Sénégal", shortName: "CITIBANK", type: "bank", presence: "filiale", bic: "CITISNDA" },
  { country: "SN", registration: "K 0060 E", name: "Crédit du Sénégal", shortName: "CDS", type: "bank", presence: "filiale", bic: "BCMASNDA" },
  { country: "SN", registration: "K 0156 J", name: "Crédit International", shortName: "CI", type: "bank", presence: "filiale", bic: "CLIBSNDA" },
  { country: "SN", registration: "K 0189 V", name: "BGFIBank Sénégal", shortName: "BGFIBANK", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0094 R", name: "Ecobank - Sénégal", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCSNDA" },
  { country: "SN", registration: "K 0140 R", name: "FBNBank Sénégal", shortName: "FBNBANK", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0011 B", name: "Société Générale Sénégal", shortName: "SG SÉNÉGAL", type: "bank", presence: "filiale", bic: "SGSNSNDA" },
  { country: "SN", registration: "K 0153 F", name: "United Bank for Africa Sénégal", shortName: "UBA SÉNÉGAL", type: "bank", presence: "filiale", bic: "UNAFSNDA" },
  { country: "SN", registration: "K 0169 Y", name: "Banque Nationale pour le Développement Économique", shortName: "BNDE", type: "bank", presence: "filiale", bic: "BNDXSNDA" },
  { country: "SN", registration: "K 0191 X", name: "Afrika Banque Sénégal (ex Banque de Dakar)", shortName: "AFRIKA BANQUE SN", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0200 G", name: "La Banque Ourtade", shortName: "LBO", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0213 W", name: "Coris Bank International - Sénégal", shortName: "CBI-SÉNÉGAL", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0263 A", name: "Algerian Bank of Sénégal", shortName: "ABS", type: "bank", presence: "filiale" },
  { country: "SN", registration: "K 0175 E", name: "Orabank Côte d'Ivoire, Succursale du Sénégal", shortName: "ORABANK", type: "bank", presence: "succursale", bic: "ORBKSNDA" },
  { country: "SN", registration: "K 0159 M", name: "NSIA Banque Bénin, Succursale du Sénégal", shortName: "NSIA BANQUE", type: "bank", presence: "succursale" },
  { country: "SN", registration: "K 0178 H", name: "Banque pour le Commerce et l'Industrie du Mali (BCI-Mali), Succursale du Sénégal", shortName: "BCI-MALI", type: "bank", presence: "succursale" },
  { country: "SN", registration: "K 0236 W", name: "Bridge Bank Group Côte d'Ivoire (BBG-CI), Succursale du Sénégal", shortName: "BBG-CI", type: "bank", presence: "succursale" },
  { country: "SN", registration: "K 0258 V", name: "Banque de Développement du Mali (BDM), Succursale du Sénégal", shortName: "BDM", type: "bank", presence: "succursale" },
  { country: "SN", registration: "K 0305 W", name: "Orange Bank Africa, Succursale du Sénégal", shortName: "ORANGE BANK", type: "bank", presence: "succursale" },
  { country: "SN", registration: "K 0203 K", name: "La Financière de l'Afrique de l'Ouest", shortName: "FINAO", type: "financial", presence: "filiale" },
  { country: "SN", registration: "K 0029 W", name: "Compagnie Ouest Africaine de Crédit-Bail (Locafrique)", shortName: "LOCAFRIQUE", type: "financial", presence: "filiale" },
  { country: "SN", registration: "K 0192 Y", name: "Wafacash West Africa", shortName: "WAFACASH", type: "financial", presence: "filiale" },
  { country: "SN", registration: "K 0145 X", name: "Société Africaine de Crédit Automobile (SAFCA - Alios Finance), Succursale du Sénégal", shortName: "SAFCA", type: "financial", presence: "succursale" },

  // ───────────────────────────── TOGO (T → TG) ──────────────────────────────
  { country: "TG", registration: "T 0138 J", name: "Banque Atlantique Togo", shortName: "BANQUE ATLANTIQUE", type: "bank", presence: "filiale", bic: "ATTGTGTG" },
  { country: "TG", registration: "T 0005 P", name: "Banque Internationale pour l'Afrique au Togo", shortName: "BIA-TOGO", type: "bank", presence: "filiale", bic: "BILTTGTG" },
  { country: "TG", registration: "T 0151 Y", name: "Sunu Bank", shortName: "SUNU BANK", type: "bank", presence: "filiale" },
  { country: "TG", registration: "T 0133 D", name: "Banque Sahélo-Saharienne pour l'Investissement et le Commerce - Togo", shortName: "BSIC-TOGO", type: "bank", presence: "filiale", bic: "BSAHTGTG" },
  { country: "TG", registration: "T 0024 K", name: "International Business Bank Togo (ex BTCI)", shortName: "IB BANK TOGO", type: "bank", presence: "filiale", bic: "BTCITGTG" },
  { country: "TG", registration: "T 0055 T", name: "Ecobank - Togo", shortName: "ECOBANK", type: "bank", presence: "filiale", bic: "ECOCTGTG" },
  { country: "TG", registration: "T 0116 K", name: "Orabank Togo", shortName: "ORABANK", type: "bank", presence: "filiale", bic: "ORBKTGTG" },
  { country: "TG", registration: "T 0027 N", name: "Société Interafricaine de Banque", shortName: "SIAB", type: "bank", presence: "filiale", bic: "SIABTGTG" },
  { country: "TG", registration: "T 0009 T", name: "Union Togolaise de Banque", shortName: "UTB", type: "bank", presence: "filiale", bic: "UNTBTGTG" },
  { country: "TG", registration: "T 0167 Q", name: "Bank of Africa Togo", shortName: "BOA-TOGO", type: "bank", presence: "filiale", bic: "AFRITGTG" },
  { country: "TG", registration: "T 0182 G", name: "Coris Bank International - Togo", shortName: "CBI-TOGO", type: "bank", presence: "filiale" },
  { country: "TG", registration: "T 0160 H", name: "NSIA Banque Bénin, Succursale du Togo", shortName: "NSIA BANQUE", type: "bank", presence: "succursale" },
  { country: "TG", registration: "T 0187 M", name: "Société Générale Bénin, Succursale du Togo", shortName: "SG BÉNIN", type: "bank", presence: "succursale" },
  { country: "TG", registration: "T 0221 Z", name: "Banque de Développement du Mali (BDM), Succursale du Togo", shortName: "BDM", type: "bank", presence: "succursale" },
  { country: "TG", registration: "T 0165 N", name: "Caisse Régionale de Refinancement Hypothécaire de l'UEMOA", shortName: "CRRH-UEMOA", type: "financial", presence: "filiale" },
  { country: "TG", registration: "T 0076 R", name: "African Guarantee Fund pour les Petites et Moyennes Entreprises", shortName: "AGF WEST AFRICA", type: "financial", presence: "filiale" },
  { country: "TG", registration: "T 0215 S", name: "African Lease Togo", shortName: "ALT", type: "financial", presence: "filiale" },
];
