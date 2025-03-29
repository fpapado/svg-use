# @svg-use/rollup

## 0.5.0

### Minor Changes

- 6714f72: Add an additional `fallbackRootFill` option to plugin transforms and
  `transformSvgForUseHref`, as well as a `{fallbackRootFill}` option bag to the
  core functions (`svgoMakeThemable`, `xastMakeThemable`).

  This adds a missing step to making arbitrary SVGs (including those without any
  fills or strokes) themeable. The `fallbackRootFill` option defines a color
  that will be set as the fill attribute on the SVG root, if there are no fills
  or strokes declared.

  This step is performed prior to the themeing transform, so existing transforms
  will keep working. We recommend that you set this option to an appropriate
  value, but for now it is optional in order to avoid breaking changes.

  Originally contributed by @mcler in
  [#105](https://github.com/fpapado/svg-use/pull/105).

### Patch Changes

- Updated dependencies [6714f72]
  - @svg-use/core@0.5.0

## 0.4.1

### Patch Changes

- 5f6340e: Make `@svg-use/react` a dependency of plugins.
- Updated dependencies [0ea4fd9]
- Updated dependencies [05fa11e]
  - @svg-use/core@0.4.0
  - @svg-use/react@0.4.0

## 0.4.0

### Minor Changes

- 4ccc16a: Introduce `emitFile` in `AdvancedOptions`, to support Vite wrappers.

## 0.3.0

### Minor Changes

- 86c4f14: Introduce ?noTheme config query, in types, docs and examples.
- 86c4f14: Breaking change: The default theme has changed.

  - Instead of separating fills and strokes, equal colors are substituted in the
    same way. This makes it easier to support monotone/duotone/tritone themes,
    and reduces the output size.
  - The CSS custom properties have changed, to `--svg-use-color-*`

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
