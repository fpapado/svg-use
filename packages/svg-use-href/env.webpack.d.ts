/** Ambient declarations for the recommended webpack config, using resource queries */
declare module '*?svgUseHref' {
  export const url: string;
  export const id: string;
  export const viewBox: string;
  // TODO: figure out how to type this
  // export const Component: string;
}
