/**
 * @categoryDescription Primary functions
 *
 * These are the main transformation functions. You would typically use these
 * when implementing bundler plugins or codegen.
 *
 * @categoryDescription Primary function defaults
 *
 * The default / quick-start config for the primary functions. It is recommended
 * that you use these defaults if you are implementing a generic bundler plugin.
 * You can of course deviate from them for more bespoke use-cases.
 *
 * @packageDocumentation
 */
export {
  type TransformOptions,
  type UseHrefInfo,
  transformSvgForUseHref,
} from './transformSvgForUseHref.js';
export {
  type ComponentFactory,
  type ComponentFactoryFunction,
  type ModuleFactoryParams,
  type ModuleFactoryOptions,
  createJsModule,
  defaultComponentFactory,
} from './createJsModule.js';
export {
  type GetSvgIdFunction,
  defaultGetSvgIdAttribute,
} from './getSvgIdAttribute.js';
export { type Result } from './result.js';
export {
  getDefaultThemeSubstitutionFunction,
  defaultFallbackRootFill,
} from './theme/defaultTheme.js';
export {
  type GetThemeSubstitutionFunction,
  type XastMakeThemeableOptions,
  xastMakeThemeable,
} from './theme/makeThemeable.js';
export { svgoMakeThemeable } from './theme/svgoMakeThemeable.js';
