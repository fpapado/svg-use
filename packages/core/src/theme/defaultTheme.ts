import type { GetThemeSubstitutionFunction } from './makeThemeable.js';

const fillCustomProperties = [
  'use-href-fill-primary',
  'use-href-fill-secondary',
  'use-href-fill-tertiary',
];

const strokeCustomProperties = [
  'use-href-stroke-primary',
  'use-href-stroke-secondary',
  'use-href-stroke-tertiary',
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
  if (fills.size > 3 || strokes.size > 3) {
    throw new Error(
      'Cannot substitute theme for SVGs with more than 3 colors. Please use a resource query to mark this SVG as unthemed.',
    );
  }

  const substitutedFills = Array.from(fills.entries()).map(
    ([fill], i) =>
      [
        fill,
        substituteCustomProperty(fillCustomProperties.at(i), fill),
      ] as const,
  );

  const substitutedStrokes = Array.from(strokes.entries()).map(
    ([stroke], i) =>
      [
        stroke,
        substituteCustomProperty(strokeCustomProperties.at(i), stroke),
      ] as const,
  );

  return {
    fills: new Map(substitutedFills),
    strokes: new Map(substitutedStrokes),
  };
};
