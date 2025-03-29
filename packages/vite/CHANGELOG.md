# @svg-use/vite

## 0.2.0

### Minor Changes

- 4f07380: Add an additional `fallbackRootFill` option to plugin transforms and
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

- Updated dependencies [4f07380]
  - @svg-use/rollup@0.5.0

## 0.1.3

### Patch Changes

- 3e7af4f: Fix reference to @svg-use/react types in client dts reference.

## 0.1.2

### Patch Changes

- 5f6340e: Make `@svg-use/react` a dependency of plugins.
- Updated dependencies [5f6340e]
  - @svg-use/rollup@0.4.1

## 0.1.1

### Patch Changes

- Updated dependencies [4ccc16a]
  - @svg-use/rollup@0.4.0
