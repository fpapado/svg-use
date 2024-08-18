import type { GetThemeSubstitutionFunction } from './makeThemeable.js';

const customProperties = [
  'svg-use-color-primary',
  'svg-use-color-secondary',
  'svg-use-color-tertiary',
];

const substituteCustomProperty = (
  property: string | undefined,
  fallbackValue: string,
) => (property ? `var(--${property}, ${fallbackValue})` : fallbackValue);

/**
 * The default theme function. Substitutes up to three sizes and strokes with
 * custom properties. Preserves existing properties as fallbacks.
 *
 * @category Primary function defaults
 */
export const defaultThemeSubstitution: GetThemeSubstitutionFunction = ({
  fills,
  strokes,
}) => {
  // We treat identical values the same, regardless of the attribute that they
  // are used for
  const mergedColors = Array.from(
    [...fills.entries(), ...strokes.entries()]
      .reduce((acc, [color, count]) => {
        acc.set(color, (acc.get(color) ?? 0) + count);
        return acc;
      }, new Map<string, number>())
      .entries(),
  ).sort((a, b) => (a[1] = b[1]));

  if (mergedColors.length > 3) {
    throw new Error(
      'Cannot substitute theme for SVGs with more than 3 colors. Use a resource query to mark this SVG as unthemed.',
    );
  }

  const substitutions = mergedColors.map(
    ([color], i) =>
      [color, substituteCustomProperty(customProperties.at(i), color)] as const,
  );

  return {
    fills: new Map(substitutions),
    strokes: new Map(substitutions),
  };
};
