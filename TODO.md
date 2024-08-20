# TODO

## v1

- Unit test the rest of svg-use/core, for consistency
- Consider providing the defaults for svg-use/core functions directly in the
  functions themselves.

## For later

- Maybe we need to customise the query parameter in the rollup plugin, to alow
  people to create their own config
- Smoke test `examples`
- Create a "vanilla" rollup example
- Create a CLI, or explicitly decide against one.
- Shipping the default theme and the consumer function in two separate packages
  is a bit annoying
  - Perhaps we can ship two separate .d.ts. files: /client and /client/react
