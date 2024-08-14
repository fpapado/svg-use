# TODO

## v1

- Changeset publishing, with provenance
- Implement "unthemed" mode
- Investigate removing the viewBox. Perhaps we need to ensure that a viewBox
  exists, but not that it lines up in the `use` element.

## For later

- Create a separate Vite plugin
  - Rollup-only is OK for now,
  - Perhaps it is ok to only do checks, but return the original asset, and leave
    the rest to a ClI
- Create a CLI
