import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import type { ReactNode } from "react";
import "nextra-theme-docs/style.css";

export const metadata = {
  metadataBase: new URL("https://uemoa-bank-resolver.vercel.app"),
  title: {
    default: "UEMOA Bank Resolver — Validate & identify any UEMOA/BCEAO IBAN or RIB",
    template: "%s – UEMOA Bank Resolver",
  },
  description:
    "Validate, decompose and identify the bank behind any UEMOA / BCEAO IBAN or RIB. Offline, fully typed, zero runtime dependencies.",
  openGraph: {
    type: "website",
    title: "UEMOA Bank Resolver",
    description:
      "Validate, decompose and identify the bank behind any UEMOA / BCEAO IBAN or RIB.",
    siteName: "UEMOA Bank Resolver",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const navbar = (
    <Navbar
      logo={<b>🏦 UEMOA Bank Resolver</b>}
      projectLink="https://github.com/kouameYao/uemoa-bank-resolver"
    />
  );
  const footer = <Footer>MIT © {new Date().getFullYear()} — UEMOA Bank Resolver</Footer>;

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          docsRepositoryBase="https://github.com/kouameYao/uemoa-bank-resolver/tree/main/docs"
          pageMap={await getPageMap()}
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
