import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    title: "Home",
    type: "page",
    display: "hidden",
    theme: { layout: "full", toc: false, sidebar: false, breadcrumb: false },
  },
  introduction: "Introduction",
  installation: "Installation",
  "quick-start": "Quick Start",
  playground: "Playground",
  "api-reference": "API Reference",
  "rib-format": "RIB Format Guide",
  "supported-countries": "Supported Countries",
  faq: "FAQ",
  security: "Security",
};

export default meta;
