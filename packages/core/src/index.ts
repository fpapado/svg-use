export {
  type TransformOptions,
  transformSvgForUseHref,
} from './transformSvgForUseHref.js';
export {
  type ComponentFactory,
  type ComponentFactoryFunction,
  type ModuleFactoryOptions,
  createJsModule,
  defaultComponentFactory,
} from './createJsModule.js';
export {
  type GetSvgIdFunction,
  defaultGetSvgIdAttribute,
} from './getSvgIdAttribute.js';
export { type Result } from './result.js';
export { defaultThemeSubstitution } from './theme/defaultTheme.js';
export { xastMakeThemeable } from './theme/makeThemeable.js';
export { svgoMakeThemeable } from './theme/svgoMakeThemeable.js';
