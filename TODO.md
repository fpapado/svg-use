# TODO

## v1

- Add `{monochromeBehavior?: 'use-currentColor-fallback'}` to default theme
  transform
- Consider customising the prefix of custom properties, both in the default
  theme and in react
- Unit test the rest of svg-use/core, for consistency
- Consider providing the defaults for svg-use/core functions directly in the
  functions themselves.
  - Resolution: provide a default for the SVG id, but make theme an explicit
    opt-in
  - Consider renaming getThemeSubstitions to themeTransformer

## For later

- Provide examples with using SVGO
- Maybe we need to customise the query parameter in the rollup plugin, to alow
  people to create their own config
- Smoke test `examples`
- Create a "vanilla" rollup example
- Create a CLI, or explicitly decide against one.
- Shipping the default theme and the consumer function in two separate packages
  is a bit annoying
  - Perhaps we can ship two separate .d.ts. files: /client and /client/react
- Performance: we are double-parsing the SVG, once with SVGO, and once with
  fromXML. We should probably only parse / visit once. This would require
  implementing a wrapper for SVGO's plugins.
