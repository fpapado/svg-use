---
'@svg-use/webpack': minor
'@svg-use/rollup': minor
'@svg-use/core': minor
---

Breaking change: The default theme has changed.

- Instead of separating fills and strokes, equal colors are substituted in the
  same way. This makes it easier to support monotone/duotone/tritone themes, and
  reduces the output size.
- The CSS custom properties have changed, to `--svg-use-color-*`
