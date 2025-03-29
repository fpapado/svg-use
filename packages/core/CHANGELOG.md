# @svg-use/core

## 0.4.0

### Minor Changes

- 0ea4fd9: Breaking: `defaultThemeSubstitution` now takes an option object, so
  its signature has changed to a factory:

  ```diff-js
  const options = {
  -  getThemeSubstitutions: defaultThemeSubstitution
  +  getThemeSubstitutions: defaultThemeSubstitution()
  }
  ```

  `defaultThemeSubstitution` now provides a `monochromeCssVarFallback` option,
  to allow passing `currentColor` as the `var()` fallback.

## 0.3.0

### Minor Changes

- 86c4f14: Export all publicly-visible types
- 86c4f14: Breaking change: The default theme has changed.

  - Instead of separating fills and strokes, equal colors are substituted in the
    same way. This makes it easier to support monotone/duotone/tritone themes,
    and reduces the output size.
  - The CSS custom properties have changed, to `--svg-use-color-*`

## 0.2.0

### Minor Changes

- 01467a7: Refactor @svg-use/core API, update plugins to use it.

## 0.1.1

### Patch Changes

- 616778e: Fix erroneous assignment of fills in the default theme function
