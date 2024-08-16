# TODO

## v1

- Default theme: Instead of separating strokes/fills just replace the values
  verbatim.
- Implement "unthemed" mode
  - Add `unthemed` parameter in the recommended webpack config
  - Add `unthemed` parameter in the rollup plugin
  - Corollary: maybe we need to customise the query parameter in the rollup
    plugin, to alow people to create their own defaults
- Unit test the rest of svg-use/core, for consistency
- Investigate removing the `viewBox` requirement, or provide the rationale for
  it. SVGs keep their intrinsic size based on some default. Should make a
  codepen, to demonstrate.
- Consider providing the defaults for svg-use/core functions directly in the
  functions themselves.
- Improve the tsdoc for svg-use/core, especially for the main two exports.
  Should use some `@inheritdoc` magic to ensure that the options and the
  function both get nice documentation.

## For later

- Smoke test `examples`
- Create a separate Vite plugin
  - Rollup-only is OK for now,
  - Perhaps it is ok to only do checks, but return the original asset, and leave
    the rest to a ClI
- Create a CLI, or explicitly decide against one.
