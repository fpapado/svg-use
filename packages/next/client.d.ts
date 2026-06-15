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
   *
   * This assumes the default factory function. Feel free to override this in
   * your own module declaration if using a different factory.
   */
  export const Component: ReturnType<
    typeof import('@svg-use/react').createThemedExternalSvg
  >;
}

declare module '*?extract&unthemed' {
  export const url: string;
  export const id: string;
  export const viewBox: string;

  /**
   * A ready-to-use React component that references the SVG without theme
   * substitution (useful for multi-colour assets like flags).
   *
   * This assumes the default factory function. Feel free to override this in
   * your own module declaration if using a different factory.
   */
  export const Component: ReturnType<
    typeof import('@svg-use/react').createThemedExternalSvg
  >;
}
