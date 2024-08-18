# @svg-use/core

## 0.3.0

### Minor Changes

- 3b5c46e: Export all publicly-visible types
- 3b5c46e: Breaking change: The default theme has changed.

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
