export interface ModuleFactoryParams {
  url: string;
  id: string;
  viewBox: string;
}

export interface ModuleFactoryOptions {
  /**
   * Configuration for the "Component" export. Pass null to skip the factory
   * altogether.
   */
  componentFactory: ComponentFactory | null;
}

export type ComponentFactoryFunction = (props: {
  url: string;
  id: string;
  viewBox: string;
}) => unknown;

/**
 * Configuration for the "Component" export.
 */
export type ComponentFactory = {
  /**
   * The name of the component factory function. Should conform to the
   * {@link ComponentFactoryFunction} interface.
   *
   * @example "createThemedExternalSvg"
   */
  functionName: string;
  /**
   * An ES module import path, that the factory function will be imported from (as a named import).
   *
   * @example "\@svg-use/react"
   */
  importFrom: string;
};

/**
 * @category Primary function defaults
 */
export const defaultComponentFactory: ComponentFactory = {
  functionName: `createThemedExternalSvg`,
  importFrom: `@svg-use/react`,
};

/**
 * Takes a descriptor for an external SVG, and returns a JS module string, that
 * exposes all relevant information to embed the SVG via `use[href]`. Also
 * exposes a component (via a factory), for convenience.
 *
 * This module is what a runtime would see eventually.
 *
 * @category Primary functions
 */
export const createJsModule = (
  { url, id, viewBox }: ModuleFactoryParams,
  { componentFactory: cf }: ModuleFactoryOptions,
): string => {
  if (cf === null) {
    return `export const url = ${url};
export const id = ${id};
export const viewBox = ${viewBox};`;
  }

  return `import {${cf.functionName}} from ${JSON.stringify(cf.importFrom)};
  
export const url = ${url};
export const id = ${id};
export const viewBox = ${viewBox};

export const Component = ${cf.functionName}({url, id, viewBox});`;
};
