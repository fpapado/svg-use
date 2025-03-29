import type { CustomPlugin } from 'svgo';
import {
  type GetThemeSubstitutionFunction,
  type XastMakeThemeableOptions,
  xastMakeThemeable,
} from './makeThemeable.js';

/**
 * Substitute hardcoded color values with other ones (usually custom
 * properties). SVGO-compatible version of {@link xastMakeThemeable}
 */
export const svgoMakeThemeable = (
  themeSubstitutionFunction: GetThemeSubstitutionFunction,
  options?: XastMakeThemeableOptions,
): CustomPlugin => ({
  name: 'make-themeable',
  fn: (root) => {
    // XastRoot does not line up with Root in the types, but they are both xast
    // roots, so the cast is safe. makeThemeable does its own visiting of the
    // tree (in two passes), so we do not use SVGO's visitor.
    // @ts-expect-error -- the types do not line up, as above
    xastMakeThemeable(root, themeSubstitutionFunction, options);
    return null;
  },
});
