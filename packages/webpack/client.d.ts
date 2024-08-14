/** Ambient declarations for the rollup plugin, using a path prefix */
declare module '*?svgUse' {
  export const url: string;
  export const id: string;
  export const viewBox: string;
  // TODO: figure out how to type this
  // export const Component: string;
}
