# @svg-use/react

## 1.1.0

### Minor Changes

- 97bb310: Ensure that createThemedExternalSvg forwards refs, so that refs can
  be assigned in React 18.

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

## 0.4.3

### Patch Changes

- f917214: Use URL.parse() as a progressive enhancement in dev-only checks,
  using new URL() otherwise.

## 0.4.2

### Patch Changes

- efa4f32: Fix: ensure that the result of `config.rewritePath` gets passed down
  to the inner SVG.

## 0.4.1

### Patch Changes

- 757b946: Fix `createThemedExternalSvg` props to reference SVGAttributes

## 0.4.0

### Minor Changes

- 05fa11e: Breaking change: `Props` now extend `SVGAttributes<SVGSVGElement>`
  instead of `HTMLAttributes<SVGSVGElement>`. This should be _more_ permissive
  in most practical SVG cases, but it might cause type errors with existing uses
  of `ThemedExternalSvg`.

## 0.3.0

### Minor Changes

- 86c4f14: Breaking change: The default theme has been updated. ThemeProps now
  accept color/colorSecondary/colorTertiary, instead of separating fills and
  strokes.
- 86c4f14: Export the default Component in bundler ambient type declarations.

## 0.2.0

### Minor Changes

- 01467a7: Add configContext, to allow rewriting URLs and toggling runtime
  checks.
- 01467a7: Rename `ThemedSvg` to `ThemedExternalSvg`, to align with the factory
  function
