# @svg-use/react

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
