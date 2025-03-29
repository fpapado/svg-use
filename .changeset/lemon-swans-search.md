---
'@svg-use/core': minor
'@svg-use/rollup': minor
'@svg-use/vite': minor
'@svg-use/webpack': minor
---

Add an additional `fallbackRootFill` option to plugin transforms and
`transformSvgForUseHref`, as well as a `{fallbackRootFill}` option bag to the
core functions (`svgoMakeThemable`, `xastMakeThemable`).

This adds a missing step to making arbitrary SVGs (including those without any
fills or strokes) themeable. The `fallbackRootFill` option defines a color that
will be set as the fill attribute on the SVG root, if there are no fills or
strokes declared.

This step is performed prior to the themeing transform, so existing transforms
will keep working. We recommend that you set this option to an appropriate
value, but for now it is optional in order to avoid breaking changes.

Originally contributed by @mcler in
[#105](https://github.com/fpapado/svg-use/pull/105).
