# @svg-use/webpack

## 0.3.1

### Patch Changes

- 5f6340e: Make `@svg-use/react` a dependency of plugins.
- Updated dependencies [0ea4fd9]
- Updated dependencies [05fa11e]
  - @svg-use/core@0.4.0
  - @svg-use/react@0.4.0

## 0.3.0

### Minor Changes

- 86c4f14: Breaking change: The default theme has changed.

  - Instead of separating fills and strokes, equal colors are substituted in the
    same way. This makes it easier to support monotone/duotone/tritone themes,
    and reduces the output size.
  - The CSS custom properties have changed, to `--svg-use-color-*`

- 86c4f14: Introduce ?noTheme config query, in types, docs and examples.
- 86c4f14: Export the default Component in bundler ambient type declarations.

### Patch Changes

- Updated dependencies [86c4f14]
- Updated dependencies [86c4f14]
- Updated dependencies [86c4f14]
- Updated dependencies [86c4f14]
  - @svg-use/core@0.3.0
  - @svg-use/react@0.3.0

## 0.2.0

### Minor Changes

- 01467a7: Refactor @svg-use/core API, update plugins to use it.

### Patch Changes

- Updated dependencies [01467a7]
  - @svg-use/core@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies [616778e]
  - @svg-use/core@0.1.1
