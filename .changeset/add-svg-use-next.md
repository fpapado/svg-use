---
"@svg-use/next": major
---

New package: `@svg-use/next` — a Turbopack-compatible webpack loader for Next.js 15.3+/16+.

Uses `fs.writeFileSync` to emit processed SVG assets instead of `this.emitFile`,
which Turbopack does not implement. The exported `url`, `id`, `viewBox`, and
`Component` have the same shape as `@svg-use/webpack`, so the two loaders can be
swapped with minimal configuration changes.

New options compared to `@svg-use/webpack`:
- `outputDir` (required) — absolute path to write SVG assets into
- `publicPath` (optional, default `'/_next/static/svgAssets/'`) — URL prefix for the `url` export
