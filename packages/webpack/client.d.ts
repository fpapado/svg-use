/**
 * Ambient declarations for the webpack plugin, using the default query setup.
 */
declare module '*?svgUse' {
  export const url: string;
  export const id: string;
  export const viewBox: string;

  /**
   * A ready-to-use react component, that references the SVG.
   *
   * This assumes the default factory function. Feel free to override this in
   * your own module declaration, if using a different factory.
   */
  export const Component: ReturnType<
    typeof import('@svg-use/react').createThemedExternalSvg
  >;
}

declare module '*?svgUse&noTheme' {
  export const url: string;
  export const id: string;
  export const viewBox: string;

  /**
   * A ready-to-use react component, that references the SVG.
   *
   * This assumes the default factory function. Feel free to override this in
   * your own module declaration, if using a different factory.
   */
  export const Component: ReturnType<
    typeof import('@svg-use/react').createThemedExternalSvg
  >;
}
