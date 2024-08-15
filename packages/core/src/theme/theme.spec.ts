import { describe, expect, it } from 'vitest';
import { defaultThemeSubstitution } from './defaultTheme.js';

describe('defaultThemeSubstitution', () => {
  it('returns the expected substitutions, in sorted order', () => {
    expect(
      defaultThemeSubstitution({
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
        ['#123', 'var(--use-href-fill-primary, #123)'],
        ['red', 'var(--use-href-fill-secondary, red)'],
        ['blue', 'var(--use-href-fill-tertiary, blue)'],
      ]),
      strokes: new Map([
        ['#123', 'var(--use-href-stroke-primary, #123)'],
        ['red', 'var(--use-href-stroke-secondary, red)'],
        ['blue', 'var(--use-href-stroke-tertiary, blue)'],
      ]),
    });
  });

  it('throws when there are more than three colors', () => {
    expect(() =>
      defaultThemeSubstitution({
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
      `[Error: Cannot substitute theme for SVGs with more than 3 colors. Please use a resource query to mark this SVG as unthemed.]`,
    );
  });
});

describe('xastMakeThemeable', () => {
  it.todo('applies the substitution function as intended');
  it.todo('passes sorted values to the substitution function');
  it.todo('does not pass `none` type values to the substitution function');
});
