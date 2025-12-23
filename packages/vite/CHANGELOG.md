# @svg-use/vite

## 1.1.0

### Minor Changes

- 4f5f623: Correctly declare the respective bundlers as peers

### Patch Changes

- Updated dependencies [4f5f623]
- Updated dependencies [4f5f623]
  - @svg-use/rollup@1.1.0
  - @svg-use/react@1.1.0

## 1.0.0

### Major Changes

- 05f2eb0: All `@svg-use` packages are now in v1! The external API should be
  unchanged from the 0.x versions, with only a change to peer dependencies.
  Moreover, the default value for `fallbackRootFill` has been changed to `#000`.

  Changes since 0.x:
  - `@svg-use/react` correctly declares peer dependencies on react and
    react-dom. Both versions ^18 and ^19 are allowed.
  - `@svg-use/webpack`, `@svg-use/vite`, `@svg-use/rollup` correctly declare an
    **optional** peer dependency on `@svg-use/react`. This allows using other
    wrappers of your choice, without unnecessary installations. The installation
    instructions mention installing `@svg-use/react` directly in your project,
    if you use the default config. For example:

    ```console
    pnpm add --save-dev @svg-use/vite
    pnpm add @svg-use/react
    ```

  - `@svg-use/webpack`, `@svg-use/vite`, `@svg-use/rollup` and
    `transformSvgForUseHref` from `@svg-use/core` now use a default value of
    `#000` for `fallbackRootFill`. This is overall a better default, because it
    accounts for SVGs that have no fill or stroke, while allowing theme
    substitutions to work seamlessly. If you find that this throws off existing
    substitutions functions, you are encouraged to change the setting and/or
    open an issue to discuss it.

### Patch Changes

- Updated dependencies [05f2eb0]
  - @svg-use/rollup@1.0.0
  - @svg-use/react@1.0.0

## 0.2.0

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
