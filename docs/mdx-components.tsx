import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";

const themeComponents = getThemeComponents();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMDXComponents(components?: any) {
  return { ...themeComponents, ...components };
}
