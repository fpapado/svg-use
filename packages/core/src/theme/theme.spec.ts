import { describe, expect, it } from 'vitest';
import { defaultThemeSubstitution } from './defaultTheme.js';

describe('defaultThemeSubstitution', () => {
  it('returns the expected substitutions, in sorted order', () => {
    expect(
      defaultThemeSubstitution()({
        fills: new Map([
          ['#123', 3],
          ['red', 2],
          ['blue', 1],
        ]),
        strokes: new Map([
          ['#123', 3],
          ['red', 2],
          ['blue', 1],
        ]),
      }),
    ).toEqual({
      fills: new Map([
        ['#123', 'var(--svg-use-color-primary, #123)'],
        ['red', 'var(--svg-use-color-secondary, red)'],
        ['blue', 'var(--svg-use-color-tertiary, blue)'],
      ]),
      strokes: new Map([
        ['#123', 'var(--svg-use-color-primary, #123)'],
        ['red', 'var(--svg-use-color-secondary, red)'],
        ['blue', 'var(--svg-use-color-tertiary, blue)'],
      ]),
    });
  });

  it('provides an option to fall back to currentColor for monochrome icons', () => {
    expect(
      defaultThemeSubstitution({ monochromeCssVarFallback: 'currentColor' })({
        fills: new Map([['#123', 3]]),
        strokes: new Map([['#123', 3]]),
      }),
    ).toEqual({
      fills: new Map([['#123', 'var(--svg-use-color-primary, currentColor)']]),
      strokes: new Map([
        ['#123', 'var(--svg-use-color-primary, currentColor)'],
      ]),
    });
  });

  it('throws when there are more than three colors', () => {
    expect(() =>
      defaultThemeSubstitution()({
        fills: new Map([
          ['#123', 3],
          ['red', 2],
          ['blue', 1],
          ['currentColor', 1],
        ]),
        strokes: new Map([
          ['#123', 3],
          ['red', 2],
          ['blue', 1],
          ['currentColor', 1],
        ]),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot substitute theme for SVGs with more than 3 colors. Use a resource query to mark this SVG as unthemed.]`,
    );
  });
});

describe('xastMakeThemeable', () => {
  it.todo('applies the substitution function as intended');
  it.todo('passes sorted values to the substitution function');
  it.todo('does not pass `none` type values to the substitution function');
});
