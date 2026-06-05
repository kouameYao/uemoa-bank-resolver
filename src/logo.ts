import type { Bank } from "./types";

/**
 * Logo providers that build an image URL from a website domain.
 * - `google` / `duckduckgo`: free, no key (favicon-quality).
 * - `clearbit`: free, no key (full logos; availability not guaranteed).
 * - `logodev` / `brandfetch`: higher quality, require a `token`.
 */
export type LogoProvider = "google" | "duckduckgo" | "clearbit" | "logodev" | "brandfetch";

export interface LogoOptions {
  /** Provider used to build the URL. Default `"google"`. */
  provider?: LogoProvider;
  /** Square size hint in px (providers that support it). Default `128`. */
  size?: number;
  /** API token, required by `logodev` and `brandfetch`. */
  token?: string;
}

/** Extract a bare domain ("ecobank.com") from a URL, domain, or `null`. */
function toDomain(value: string | null | undefined): string | null {
  if (!value) return null;
  const domain = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0];
  // Must look like a domain (contains a dot, no spaces).
  return domain && /^[^\s]+\.[^\s]+$/.test(domain) ? domain : null;
}

/**
 * Build a logo URL for a bank (or a raw domain), without bundling any
 * trademarked image. Returns `null` when no domain is available.
 *
 * Resolution order for a {@link Bank}: explicit `logo` → `website` domain → `null`.
 *
 * @example
 * getLogoUrl(lookupBank("CI", "CI059"));               // Ecobank, via google favicons
 * getLogoUrl("societegenerale.ci", { provider: "clearbit" });
 * getLogoUrl(bank, { provider: "logodev", token: "pk_..." });
 */
export function getLogoUrl(
  input: Bank | string | null | undefined,
  options: LogoOptions = {},
): string | null {
  if (input && typeof input === "object") {
    if (input.logo) return input.logo;
    return getLogoUrl(input.website ?? null, options);
  }

  const domain = toDomain(input);
  if (!domain) return null;

  const { provider = "google", size = 128, token } = options;
  switch (provider) {
    case "google":
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
    case "duckduckgo":
      return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    case "clearbit":
      return `https://logo.clearbit.com/${domain}?size=${size}`;
    case "logodev":
      return `https://img.logo.dev/${domain}?size=${size}${token ? `&token=${token}` : ""}`;
    case "brandfetch":
      return `https://cdn.brandfetch.io/${domain}/w/${size}/h/${size}${token ? `?c=${token}` : ""}`;
    default:
      return null;
  }
}
