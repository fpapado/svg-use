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

export type DefaultThemeOptions = {
  /**
   * Configures the CSS var() fallback for monochrome icons.
   *
   * This can make monochrome icons simpler to use, at the expense of
   * consistency (or lack thereof) with duotone and tritone icons.
   *
   * 'existingValue' uses the color that already exists in the SVG, such as
   * `var(--svg-use-color-primary, #123123)`
   *
   * 'currentColor' substitutes any existing color with 'currentColor', such as
   * `var(--svg-use-color-primary, currentColor)`
   *
   * @defaultValue 'exitingValue'
   */
  monochromeCssVarFallback?: 'existingValue' | 'currentColor';
};

/**
 * The default theme function. Substitutes up to three sizes and strokes with
 * custom properties. Preserves existing properties as fallbacks.
 *
 * @category Primary function defaults
 */
export const defaultThemeSubstitution =
  ({
    monochromeCssVarFallback = 'existingValue',
  }: DefaultThemeOptions = {}): GetThemeSubstitutionFunction =>
  ({ fills, strokes }) => {
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

    const isMonochrome = mergedColors.length === 1;

    const substitutions = mergedColors.map(
      ([color], i) =>
        [
          color,
          isMonochrome && monochromeCssVarFallback === 'currentColor'
            ? substituteCustomProperty(customProperties.at(i), 'currentColor')
            : substituteCustomProperty(customProperties.at(i), color),
        ] as const,
    );

    return {
      fills: new Map(substitutions),
      strokes: new Map(substitutions),
    };
  };

export const defaultFallbackRootFill = '#000';
