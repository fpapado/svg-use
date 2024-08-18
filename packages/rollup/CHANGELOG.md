# @svg-use/rollup

## 0.3.0

### Minor Changes

- e068089: Breaking change: The default theme has changed.

  - Instead of separating fills and strokes, equal colors are substituted in the
    same way. This makes it easier to support monotone/duotone/tritone themes,
    and reduces the output size.
  - The CSS custom properties have changed, to `--svg-use-color-*`

- 989deef: Export the default Component in bundler ambient type declarations.

### Patch Changes

- Updated dependencies [ff65669]
- Updated dependencies [e068089]
- Updated dependencies [e068089]
- Updated dependencies [989deef]
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
