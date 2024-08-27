---
'@svg-use/react': minor
---

Breaking change: `Props` now extend `SVGAttributes<SVGSVGElement>` instead of
`HTMLAttributes<SVGSVGElement>`. This should be _more_ permissive in most
practical SVG cases, but it might cause type errors with existing uses of
`ThemedExternalSvg`.
