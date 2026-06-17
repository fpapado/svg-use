/**
 * Ambient declarations for the Next.js / Turbopack loader, using the default
 * query setup (condition: { query: /extract/i }).
 */
declare module '*?extract' {
  export const url: string;
  export const id: string;
  export const viewBox: string;

  /**
   * A ready-to-use React component that references the SVG.
   * Uses `createThemedSvgUse` from `@svg-use/next/component` by default —
   * an RSC-compatible factory with no hooks or context.
   *
   * Override this declaration in your own module if using a custom factory.
   */
  export const Component: ReturnType<
    typeof import('@svg-use/next/component').createThemedSvgUse
  >;
}

declare module '*?extract&unthemed' {
  export const url: string;
  export const id: string;
  export const viewBox: string;

  /**
   * A ready-to-use React component that references the SVG without theme
   * substitution (useful for multi-colour assets like flags).
   */
  export const Component: ReturnType<
    typeof import('@svg-use/next/component').createThemedSvgUse
  >;
}
